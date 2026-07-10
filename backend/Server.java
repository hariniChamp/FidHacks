import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.Executors;

/**
 * Flourish backend (FidHacks 2026 prototype).
 *
 * A zero-dependency Java HTTP server that:
 *   1. Proxies chat requests to the Anthropic API so the key never
 *      reaches the browser  (POST /api/chat)
 *   2. Serves mock client data from the /data folder (GET /api/client/{id})
 *   3. Persists saved interests to the /data folder
 *      (POST /api/client/{id}/interests)
 *   4. Serves the coach knowledge base  (GET /api/knowledge)
 *
 * Run from the backend/ folder with:  java Server.java
 * Requires Java 11+. The Anthropic key is read from the ANTHROPIC_API_KEY
 * environment variable, or from a .env file in backend/ or the repo root.
 */
public class Server {

    static final HttpClient HTTP = HttpClient.newHttpClient();
    static final String KEY = loadKey();
    static final Path DATA = findDataDir();

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newFixedThreadPool(8));

        server.createContext("/api/health", Server::handleHealth);
        server.createContext("/api/chat", Server::handleChat);
        server.createContext("/api/client/", Server::handleClient);
        server.createContext("/api/knowledge", Server::handleKnowledge);

        server.start();
        System.out.println("Flourish backend listening on http://localhost:" + port);
        System.out.println("  POST /api/chat                     -> Anthropic proxy" + (KEY == null ? "  [WARNING: no ANTHROPIC_API_KEY set]" : ""));
        System.out.println("  GET  /api/client/{id}              -> mock client data");
        System.out.println("  POST /api/client/{id}/interests    -> save interests");
        System.out.println("  GET  /api/knowledge                -> coach knowledge base");
        System.out.println("Data directory: " + DATA.toAbsolutePath());
    }

    /* ---------------- handlers ---------------- */

    static void handleHealth(HttpExchange ex) throws IOException {
        if (preflight(ex)) return;
        respond(ex, 200, "{\"ok\":true,\"service\":\"flourish-backend\"}");
    }

    static void handleChat(HttpExchange ex) throws IOException {
        if (preflight(ex)) return;
        if (!"POST".equals(ex.getRequestMethod())) { respond(ex, 405, err("Use POST")); return; }
        if (KEY == null) { respond(ex, 500, err("ANTHROPIC_API_KEY is not set on the backend. Add it to backend/.env and restart.")); return; }

        byte[] body = ex.getRequestBody().readAllBytes();
        try {
            HttpRequest upstream = HttpRequest.newBuilder(URI.create("https://api.anthropic.com/v1/messages"))
                    .header("content-type", "application/json")
                    .header("x-api-key", KEY)
                    .header("anthropic-version", "2023-06-01")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();
            HttpResponse<byte[]> r = HTTP.send(upstream, HttpResponse.BodyHandlers.ofByteArray());
            respondBytes(ex, r.statusCode(), r.body());
        } catch (Exception e) {
            respond(ex, 502, err("Upstream call failed: " + e.getMessage()));
        }
    }

    static void handleClient(HttpExchange ex) throws IOException {
        if (preflight(ex)) return;
        String rest = ex.getRequestURI().getPath().substring("/api/client/".length());

        if (rest.endsWith("/interests")) {
            String id = sanitize(rest.substring(0, rest.length() - "/interests".length()));
            if (id == null) { respond(ex, 400, err("Invalid client id")); return; }
            if (!"POST".equals(ex.getRequestMethod())) { respond(ex, 405, err("Use POST")); return; }
            byte[] body = ex.getRequestBody().readAllBytes();
            Files.createDirectories(DATA.resolve("clients"));
            Files.write(DATA.resolve("clients").resolve(id + ".interests.json"), body);
            respond(ex, 200, "{\"saved\":true}");
            return;
        }

        String id = sanitize(rest);
        if (id == null) { respond(ex, 400, err("Invalid client id")); return; }
        Path f = DATA.resolve("clients").resolve(id + ".json");
        if (!Files.exists(f)) { respond(ex, 404, err("No client named " + id)); return; }
        respondBytes(ex, 200, Files.readAllBytes(f));
    }

    static void handleKnowledge(HttpExchange ex) throws IOException {
        if (preflight(ex)) return;
        Path f = DATA.resolve("knowledge-base.json");
        if (!Files.exists(f)) { respond(ex, 404, err("knowledge-base.json missing")); return; }
        respondBytes(ex, 200, Files.readAllBytes(f));
    }

    /* ---------------- helpers ---------------- */

    static boolean preflight(HttpExchange ex) throws IOException {
        cors(ex);
        if ("OPTIONS".equals(ex.getRequestMethod())) {
            ex.sendResponseHeaders(204, -1);
            ex.close();
            return true;
        }
        return false;
    }

    static void cors(HttpExchange ex) {
        Headers h = ex.getResponseHeaders();
        h.add("Access-Control-Allow-Origin", "*");
        h.add("Access-Control-Allow-Headers", "Content-Type");
        h.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    }

    static void respond(HttpExchange ex, int status, String json) throws IOException {
        respondBytes(ex, status, json.getBytes(StandardCharsets.UTF_8));
    }

    static void respondBytes(HttpExchange ex, int status, byte[] body) throws IOException {
        ex.getResponseHeaders().add("Content-Type", "application/json");
        ex.sendResponseHeaders(status, body.length == 0 ? -1 : body.length);
        if (body.length > 0) ex.getResponseBody().write(body);
        ex.close();
    }

    static String err(String msg) {
        return "{\"error\":{\"message\":\"" + msg.replace("\"", "'") + "\"}}";
    }

    static String sanitize(String id) {
        return (id != null && id.matches("[a-zA-Z0-9_-]{1,40}")) ? id : null;
    }

    static String loadKey() {
        String k = System.getenv("ANTHROPIC_API_KEY");
        if (k != null && !k.isBlank()) return k.trim();
        for (String p : new String[]{".env", "../.env"}) {
            try {
                for (String line : Files.readAllLines(Path.of(p))) {
                    line = line.trim();
                    if (line.startsWith("ANTHROPIC_API_KEY=")) {
                        String v = line.substring("ANTHROPIC_API_KEY=".length()).trim();
                        if (!v.isBlank()) return v;
                    }
                }
            } catch (Exception ignored) { }
        }
        return null;
    }

    static Path findDataDir() {
        for (String p : new String[]{"../data", "data"}) {
            Path d = Path.of(p);
            if (Files.isDirectory(d)) return d;
        }
        return Path.of("../data");
    }
}

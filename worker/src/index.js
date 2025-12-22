export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        // CORS: GitHub Pages からだけ叩けるようにする場合は、
        // wrangler.toml の [vars] に ALLOW_ORIGIN="https://<username>.github.io" を設定します。
        const allowOrigin = env.ALLOW_ORIGIN || "*";
        const corsHeaders = {
            "Access-Control-Allow-Origin": allowOrigin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Vary": "Origin",
        };

        const jsonHeaders = {
            ...corsHeaders,
            "Content-Type": "application/json; charset=utf-8",
            // 表示が古くなるのを避ける（公開カウンタは常に最新が欲しい）
            "Cache-Control": "no-store",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (url.pathname === "/counter") {
            if (request.method === "GET") {
                const row = await env.DB.prepare(
                    "SELECT count FROM counts WHERE id = ?"
                ).bind("main").first();

                const count = row?.count ?? 0;
                return new Response(JSON.stringify({ count }), { headers: jsonHeaders });
            }

            if (request.method === "POST") {
                // Use an UPSERT-like approach with D1
                await env.DB.prepare(`
          INSERT INTO counts (id, count) VALUES ('main', 1)
          ON CONFLICT(id) DO UPDATE SET count = count + 1
        `).run();

                const row = await env.DB.prepare(
                    "SELECT count FROM counts WHERE id = ?"
                ).bind("main").first();

                const count = row?.count ?? 0;
                return new Response(JSON.stringify({ count }), { headers: jsonHeaders });
            }
        }

        return new Response("Not Found", { status: 404, headers: corsHeaders });
    },
};

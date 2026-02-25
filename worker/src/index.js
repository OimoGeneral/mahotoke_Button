export default {
    async fetch(request, env) {
        const url = new URL(request.url);
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
            "Cache-Control": "no-store",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // --- 合計カウンタ ---
        if (url.pathname === "/counter") {
            if (request.method === "GET") {
                const row = await env.DB.prepare(
                    "SELECT count FROM counts WHERE id = ?"
                ).bind("main").first();

                const count = row?.count ?? 0;
                return new Response(JSON.stringify({ count }), { headers: jsonHeaders });
            }

            if (request.method === "POST") {
                // 合計カウントを +1
                await env.DB.prepare(`
                    INSERT INTO counts (id, count) VALUES ('main', 1)
                    ON CONFLICT(id) DO UPDATE SET count = count + 1
                `).run();

                // clicks テーブルにも記録（期間集計用）
                await env.DB.prepare(
                    "INSERT INTO clicks (clicked_at) VALUES (datetime('now'))"
                ).run();

                const row = await env.DB.prepare(
                    "SELECT count FROM counts WHERE id = ?"
                ).bind("main").first();

                const count = row?.count ?? 0;
                return new Response(JSON.stringify({ count }), { headers: jsonHeaders });
            }
        }

        // --- 期間別カウンタ ---
        if (url.pathname === "/counter/stats" && request.method === "GET") {
            // 今日 (UTC)
            const todayRow = await env.DB.prepare(
                "SELECT COUNT(*) AS cnt FROM clicks WHERE date(clicked_at) = date('now')"
            ).first();

            // 昨日 (UTC)
            const yesterdayRow = await env.DB.prepare(
                "SELECT COUNT(*) AS cnt FROM clicks WHERE date(clicked_at) = date('now', '-1 day')"
            ).first();

            // 今週 (月曜始まり, UTC)
            // strftime('%w') → 日曜=0, 月=1 ... 土=6
            // (w + 6) % 7 で月曜=0 にシフトし、その日数分だけ遡る
            const thisWeekRow = await env.DB.prepare(`
                SELECT COUNT(*) AS cnt FROM clicks
                WHERE date(clicked_at) >= date('now', '-' || ((strftime('%w', 'now') + 6) % 7) || ' days')
                  AND date(clicked_at) <= date('now')
            `).first();

            // 今月 (UTC)
            const thisMonthRow = await env.DB.prepare(
                "SELECT COUNT(*) AS cnt FROM clicks WHERE strftime('%Y-%m', clicked_at) = strftime('%Y-%m', 'now')"
            ).first();

            return new Response(JSON.stringify({
                today: todayRow?.cnt ?? 0,
                yesterday: yesterdayRow?.cnt ?? 0,
                this_week: thisWeekRow?.cnt ?? 0,
                this_month: thisMonthRow?.cnt ?? 0,
            }), { headers: jsonHeaders });
        }

        return new Response("Not Found", { status: 404, headers: corsHeaders });
    },
};

const STATS_SQL = `
    WITH bounds AS (
        SELECT
            datetime('now', '+9 hours', 'start of day', '-9 hours') AS today_start,
            datetime('now', '+9 hours', 'start of day', '-33 hours') AS yesterday_start,
            datetime(
                'now', '+9 hours', 'start of day',
                '-' || ((strftime('%w', 'now', '+9 hours') + 6) % 7) || ' days',
                '-9 hours'
            ) AS week_start,
            datetime('now', '+9 hours', 'start of month', '-9 hours') AS month_start,
            datetime('now', '+9 hours', 'start of day', '+15 hours') AS tomorrow_start
    ),
    recent_clicks AS (
        SELECT clicks.clicked_at, bounds.*
        FROM clicks CROSS JOIN bounds
        WHERE clicks.clicked_at >= min(bounds.week_start, bounds.month_start)
          AND clicks.clicked_at < bounds.tomorrow_start
    )
    SELECT
        coalesce(sum(CASE WHEN clicked_at >= today_start THEN 1 ELSE 0 END), 0) AS today,
        coalesce(sum(CASE WHEN clicked_at >= yesterday_start AND clicked_at < today_start THEN 1 ELSE 0 END), 0) AS yesterday,
        coalesce(sum(CASE WHEN clicked_at >= week_start THEN 1 ELSE 0 END), 0) AS this_week,
        coalesce(sum(CASE WHEN clicked_at >= month_start THEN 1 ELSE 0 END), 0) AS this_month
    FROM recent_clicks
`;

function firstResult(result) {
    return result.results?.[0] ?? {};
}

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
                const [countResult, statsResult] = await env.DB.batch([
                    env.DB.prepare("SELECT count FROM counts WHERE id = ?").bind("main"),
                    env.DB.prepare(STATS_SQL),
                ]);

                return new Response(JSON.stringify({
                    count: firstResult(countResult).count ?? 0,
                    ...firstResult(statsResult),
                }), { headers: jsonHeaders });
            }

            if (request.method === "POST") {
                // 更新、クリック記録、カウンター・統計取得を1回のD1 batchにまとめる
                const results = await env.DB.batch([
                    env.DB.prepare(`
                        INSERT INTO counts (id, count) VALUES ('main', 1)
                        ON CONFLICT(id) DO UPDATE SET count = count + 1
                    `),
                    env.DB.prepare("INSERT INTO clicks (clicked_at) VALUES (datetime('now'))"),
                    env.DB.prepare("SELECT count FROM counts WHERE id = ?").bind("main"),
                    env.DB.prepare(STATS_SQL),
                ]);

                return new Response(JSON.stringify({
                    count: firstResult(results[2]).count ?? 0,
                    ...firstResult(results[3]),
                }), { headers: jsonHeaders });
            }
        }

        // --- 期間別カウンタ ---
        if (url.pathname === "/counter/stats" && request.method === "GET") {
            const stats = await env.DB.prepare(STATS_SQL).first();
            return new Response(JSON.stringify(stats ?? {
                today: 0,
                yesterday: 0,
                this_week: 0,
                this_month: 0,
            }), { headers: jsonHeaders });
        }

        return new Response("Not Found", { status: 404, headers: corsHeaders });
    },
};


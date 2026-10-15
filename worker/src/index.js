const STATS_SQL = `
    WITH bounds AS (
        SELECT
            date('now', '+9 hours') AS today,
            date('now', '+9 hours', '-1 day') AS yesterday,
            date(
                'now', '+9 hours',
                '-' || ((strftime('%w', 'now', '+9 hours') + 6) % 7) || ' days'
            ) AS week_start,
            date('now', '+9 hours', 'start of month') AS month_start
    ),
    recent_days AS (
        SELECT daily_counts.day, daily_counts.count, bounds.*
        FROM daily_counts CROSS JOIN bounds
        WHERE daily_counts.day >= min(bounds.week_start, bounds.month_start)
          AND daily_counts.day <= bounds.today
    )
    SELECT
        coalesce(sum(CASE WHEN day = today THEN count ELSE 0 END), 0) AS today,
        coalesce(sum(CASE WHEN day = yesterday THEN count ELSE 0 END), 0) AS yesterday,
        coalesce(sum(CASE WHEN day >= week_start THEN count ELSE 0 END), 0) AS this_week,
        coalesce(sum(CASE WHEN day >= month_start THEN count ELSE 0 END), 0) AS this_month
    FROM recent_days
`;

const COUNTER_STATS_SQL = `
    WITH stats AS (${STATS_SQL})
    SELECT
        coalesce((SELECT count FROM counts WHERE id = 'main'), 0) AS count,
        stats.today,
        stats.yesterday,
        stats.this_week,
        stats.this_month
    FROM stats
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
                const result = await env.DB.prepare(COUNTER_STATS_SQL).first();
                return new Response(JSON.stringify(result ?? {
                    count: 0,
                    today: 0,
                    yesterday: 0,
                    this_week: 0,
                    this_month: 0,
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
                    env.DB.prepare(`
                        INSERT INTO daily_counts (day, count)
                        VALUES (date('now', '+9 hours'), 1)
                        ON CONFLICT(day) DO UPDATE SET count = count + 1
                    `),
                    env.DB.prepare(COUNTER_STATS_SQL),
                ]);

                return new Response(JSON.stringify({
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


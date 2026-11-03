// Worker untuk Spin board: API bilik di /api/bilik/:id, selain tu hidang fail dari folder public.
const okId = (id) => /^[a-z0-9]{4,16}$/i.test(id || "");
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

async function getRoom(env, id) {
  const row = await env.DB.prepare("SELECT data, v FROM bilik WHERE id = ?").bind(id).first();
  return json(row ? { v: row.v, data: JSON.parse(row.data) } : { v: 0, data: null });
}

async function putRoom(env, id, request) {
  const text = await request.text();
  if (text.length > 20000) return json({ error: "data terlalu besar" }, 413);
  let d;
  try { d = JSON.parse(text); } catch { return json({ error: "json rosak" }, 400); }
  if (!Array.isArray(d.items) || d.items.length > 60) return json({ error: "senarai tak sah" }, 400);
  const clean = {
    title: String(d.title || "").slice(0, 80),
    desc: String(d.desc || "").slice(0, 300),
    items: d.items.map((x) => ({
      n: String(x.n || "").slice(0, 40),
      t: !!x.t,
      c: /^#[0-9a-f]{6}$/i.test(x.c || "") ? x.c : null,
    })),
    spin: d.spin && typeof d.spin.id === "string"
      ? { id: d.spin.id.slice(0, 16), pick: Number(d.spin.pick) | 0 } : null,
  };
  const v = Date.now();
  await env.DB.prepare(
    "INSERT INTO bilik (id, data, v) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, v = excluded.v"
  ).bind(id, JSON.stringify(clean), v).run();
  return json({ v });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/api\/bilik\/([^/]+)$/);
    if (m) {
      if (!okId(m[1])) return json({ error: "id tak sah" }, 400);
      if (!env.DB) return json({ error: "binding DB belum ada" }, 500);
      try {
        if (request.method === "GET") return await getRoom(env, m[1]);
        if (request.method === "PUT") return await putRoom(env, m[1], request);
        return json({ error: "method tak dibenarkan" }, 405);
      } catch (e) {
        return json({ error: "database error: " + e.message }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

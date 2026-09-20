export async function onRequestGet(context) {
  try {
    const { env } = context;
    const { results } = await env.stu_db.prepare("SELECT * FROM stu_edits").all();
    return new Response(JSON.stringify({ success: true, edits: results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    
    // Yêu cầu passcode từ Header hoặc Body để chống spam
    const providedPin = request.headers.get("X-STU-PIN") || body.pin;
    if (providedPin !== "0070") {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
    }

    const { id, data, action } = body;
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "Missing id" }), { status: 400 });
    }

    if (action === "delete") {
      await env.stu_db.prepare("DELETE FROM stu_edits WHERE id = ?1").bind(id).run();
      return new Response(JSON.stringify({ success: true, id, deleted: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!data) {
      return new Response(JSON.stringify({ success: false, error: "Missing data" }), { status: 400 });
    }

    const dataString = typeof data === "string" ? data : JSON.stringify(data);

    await env.stu_db.prepare(
      "INSERT INTO stu_edits (id, data, updated_at) VALUES (?1, ?2, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET data=excluded.data, updated_at=CURRENT_TIMESTAMP"
    ).bind(id, dataString).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
}

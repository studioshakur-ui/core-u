// netlify/functions/admin-set-role.js
import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
    const { email, userId, role } = JSON.parse(event.body || "{}");
    if (!role || (!email && !userId)) return { statusCode: 400, body: "role + (email o userId) richiesti" };

    const url = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE;
    const admin = createClient(url, serviceKey);

    let id = userId;
    if (!id && email) {
      const { data: p, error: e1 } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();
      if (e1) return { statusCode: 400, body: e1.message };
      id = p?.id;
    }
    if (!id) return { statusCode: 404, body: "Utente non trovato" };

    const { error: upErr } = await admin
      .from("profiles")
      .upsert({ id, role }, { onConflict: "id" });
    if (upErr) return { statusCode: 400, body: upErr.message };

    return { statusCode: 200, body: JSON.stringify({ ok: true, userId: id }), headers: { "content-type": "application/json" } };
  } catch (e) {
    return { statusCode: 500, body: e.message || "Unknown error" };
  }
};


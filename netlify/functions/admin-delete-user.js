import { createClient } from "@supabase/supabase-js";
import { requireDirezione } from "./_guard.js";

export const handler = async (event) => {
  try {
    const gate = await requireDirezione(event);
    if (!gate.ok) return { statusCode: gate.statusCode, body: gate.body };

    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
    const { email, userId } = JSON.parse(event.body || "{}");
    if (!email && !userId) return { statusCode: 400, body: "email o userId richiesti" };

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

    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) return { statusCode: 400, body: error.message };

    return { statusCode: 200, body: JSON.stringify({ ok: true, userId: id }), headers: { "content-type": "application/json" } };
  } catch (e) {
    return { statusCode: 500, body: e.message || "Unknown error" };
  }
};

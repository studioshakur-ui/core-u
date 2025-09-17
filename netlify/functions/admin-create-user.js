import { createClient } from "@supabase/supabase-js";
import { requireDirezione } from "./_guard.js";

export const handler = async (event) => {
  try {
    const gate = await requireDirezione(event);
    if (!gate.ok) return { statusCode: gate.statusCode, body: gate.body };

    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
    const { email, password, role } = JSON.parse(event.body || "{}");
    if (!email || !password || !role) return { statusCode: 400, body: "email, password, role richiesti" };
    if (!["capo","manager","direzione"].includes(role)) return { statusCode: 400, body: "Ruolo non valido" };

    const url = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE;
    const admin = createClient(url, serviceKey);

    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) return { statusCode: 400, body: error.message };
    const userId = data?.user?.id;
    if (!userId) return { statusCode: 500, body: "Nessun user id" };

    const { error: upErr } = await admin.from("profiles").upsert({ id: userId, email, role }, { onConflict: "id" });
    if (upErr) return { statusCode: 400, body: upErr.message };

    return { statusCode: 200, body: JSON.stringify({ ok: true, userId }), headers: { "content-type": "application/json" } };
  } catch (e) {
    return { statusCode: 500, body: e.message || "Unknown error" };
  }
};


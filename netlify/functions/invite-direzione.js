// netlify/functions/invite-direzione.js
import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const { email } = JSON.parse(event.body || "{}");
    if (!email) return { statusCode: 400, body: "Missing 'email' in body" };

    const url = process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE; // solo in ENV Netlify
    if (!url || !serviceKey) return { statusCode: 500, body: "Missing Supabase env vars" };

    const supabase = createClient(url, serviceKey);
    const { data: invited, error: invErr } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: "https://core-v5.netlify.app/#/auth/callback",
    });
    if (invErr) return { statusCode: 400, body: invErr.message };
    const userId = invited?.user?.id;
    if (!userId) return { statusCode: 500, body: "No user id returned" };

    const { error: upErr } = await supabase.from("profiles").upsert({ id: userId, email, role: "direzione" }, { onConflict: "id" });
    if (upErr) return { statusCode: 400, body: upErr.message };

    return { statusCode: 200, body: JSON.stringify({ ok: true, userId }), headers: { "content-type": "application/json" } };
  } catch (e) {
    return { statusCode: 500, body: e.message || "Unknown error" };
  }
};

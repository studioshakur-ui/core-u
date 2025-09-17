import React, { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((t) => {
    const id = crypto.randomUUID();
    setItems((xs) => [...xs, { id, ...t }]);
    const ttl = t.ttl ?? 3500;
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), ttl);
  }, []);

  const api = {
    info: (msg, opts) => push({ type: "info", msg, ...opts }),
    ok:   (msg, opts) => push({ type: "ok",   msg, ...opts }),
    warn: (msg, opts) => push({ type: "warn", msg, ...opts }),
    err:  (msg, opts) => push({ type: "err",  msg, ...opts }),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2 px-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={
              "pointer-events-auto w-full max-w-md rounded-xl border px-4 py-3 shadow-xl backdrop-blur " +
              (t.type === "ok"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
                : t.type === "warn"
                ? "bg-amber-500/15 border-amber-500/30 text-amber-200"
                : t.type === "err"
                ? "bg-rose-500/15 border-rose-500/30 text-rose-200"
                : "bg-white/10 border-white/20 text-white")
            }
          >
            <div className="text-sm">{t.msg}</div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* Hook non bloquant : renvoie des no-op si pas de Provider */
export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) {
    const noop = () => {};
    return { info: noop, ok: noop, warn: noop, err: noop };
  }
  return ctx;
}

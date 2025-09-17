import React, { createContext, useContext, useState, useCallback } from "react";

const Ctx = createContext(null);
export function ToastProvider({ children }){
  const [items, setItems] = useState([]);
  const push = useCallback((type, text)=> {
    const id = Math.random().toString(36).slice(2);
    setItems(q=>[...q, {id,type,text}]);
    setTimeout(()=> setItems(q=> q.filter(t=>t.id!==id)), 3500);
  },[]);
  const api = {
    success:(t)=>push("success",t),
    error:(t)=>push("error",t),
    info:(t)=>push("info",t)
  };
  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="toast-host">
        {items.map(t=>(
          <div key={t.id} className={"toast "+t.type}>{t.text}</div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export function useToast(){
  const ctx = useContext(Ctx);
  if(!ctx) throw new Error("useToast must be used within <ToastProvider/>");
  return ctx;
}

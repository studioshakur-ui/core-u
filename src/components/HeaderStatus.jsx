import React from "react";
import { useSession } from "../hooks/useSession";

export default function HeaderStatus(){
  const { session } = useSession();
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/80">
      <span className={"h-2 w-2 rounded-full " + (session ? "bg-emerald-400" : "bg-rose-400")}></span>
      {session ? "Connesso" : "Non connesso"}
    </span>
  );
}

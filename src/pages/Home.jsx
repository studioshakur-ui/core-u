import React from "react";
import Header from "../components/Header";

export default function Home(){
  return (
    <div>
      <Header/>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-2">Benvenuto su CORE</h1>
        <p className="text-core-muted">Seleziona un modulo nel menu.</p>
      </main>
    </div>
  );
}

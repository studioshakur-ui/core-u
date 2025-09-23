export default function CapoHome() {
  return (
    <div className="p-10 text-center space-y-4">
      <h2 className="text-3xl font-bold">🧑‍🔧 Capo — Benvenuto</h2>
      <p className="text-gray-700">Compila il Rapportino giornaliero come sul foglio cartaceo.</p>
      <a
        href="/capo/rapportino"
        className="inline-block px-6 py-3 rounded bg-indigo-600 text-white shadow hover:shadow-lg"
      >
        Apri Rapportino
      </a>
    </div>
  );
}

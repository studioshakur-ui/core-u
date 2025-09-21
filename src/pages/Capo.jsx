export default function CapoPage() {
  return (
    <div className="bg-white rounded-2xl shadow-e1 p-4">
      <div className="text-sm text-neutral-500">Capo — editor giornaliero</div>
      <ul className="list-disc ml-5 text-sm mt-2 space-y-1">
        <li>Edizione inline (attività/ore/note) con suggerimenti</li>
        <li>Controllo dolce ore (&gt;12 h = warning)</li>
        <li>Preview PDF = export</li>
      </ul>
    </div>
  );
}

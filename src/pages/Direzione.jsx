import GraphDirezione from '../components/GraphDirezione.jsx'

const labels = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom']
const s = [10,12,9,14,16,12,8]
const s1 = [8,11,7,12,13,10,7]

export default function Direzione() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">KPI Settimanali — S vs S-1</h2>
          <p className="text-white/60 text-sm">Confronto produttività; export executive PDF arriva.</p>
        </div>
        <button className="rounded-lg bg-core-violet px-3 py-2 text-sm">Export Executive PDF</button>
      </div>
      <div className="mt-6 rounded-2xl bg-core-card p-6 shadow-soft">
        <GraphDirezione labels={labels} s={s} s1={s1} />
      </div>
    </main>
  )
}

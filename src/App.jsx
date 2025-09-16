// ⚠️ FICHIER TEMPORAIRE juste pour vérifier que React monte.
// Quand c'est bon, remets ton App.jsx réel petit à petit (Nav, Home, LoginModal, etc.)

export default function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        padding: '20px',
        fontFamily: 'system-ui',
      }}
    >
      <h1>CORE v5 — smoke test</h1>
      <p>Si tu lis ceci, React s’est bien monté 👍</p>
      <p id="main">Section #main (ancre) OK.</p>
      <p>
        Étape suivante : réintroduis tes imports un par un pour trouver celui qui
        casse en prod (LoginModal, Protected, HeaderStatus, pages…).
      </p>
    </div>
  )
}

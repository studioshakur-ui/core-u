export const Avatar: React.FC<{name:string; size?:number}> = ({name, size=32}) => {
  const initials = name.split(' ').map(s=>s[0]?.toUpperCase()).slice(0,2).join('') || '·'
  const style: React.CSSProperties = {
    width: size, height: size, borderRadius: 9999,
    background: 'linear-gradient(135deg, rgba(124,58,237,.35), rgba(124,58,237,.15))',
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
  }
  return <div aria-hidden style={style}><span style={{fontSize: size/2.5, fontWeight:700}}>{initials}</span></div>
}
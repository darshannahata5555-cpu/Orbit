import { useState } from 'react'
import { useAppData } from './data/AppData'

const DEPARTMENTS = [
  'Technicals', 'Proshows', 'Creatives PR & M', 'Sponsorship',
  'Ops & Logistics', 'Hospitality', 'Council',
]
const POSITIONS = [
  { value: 'HOD', label: 'HOD', hint: 'Head of Department' },
  { value: 'Core', label: 'Core Member', hint: 'Department core team' },
  { value: 'Member', label: 'Member', hint: 'Department volunteer' },
]

// Shown once after sign-in until the user picks a department + position.
export default function Onboarding() {
  const { me, actions } = useAppData()
  const [dept, setDept] = useState(DEPARTMENTS[0])
  const [role, setRole] = useState('Member')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const accent = '#4f46e5'

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      await actions.completeOnboarding({ dept, role })
    } catch (e2) {
      setErr(e2.message || 'Could not save. Try again.')
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ececed', fontFamily: "'Plus Jakarta Sans',sans-serif", padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 22, padding: 28, boxShadow: '0 8px 40px rgba(16,16,20,.12)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg,${accent},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 18 }}>O</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1f', marginBottom: 4 }}>Welcome{me?.name ? `, ${me.name.split(' ')[0]}` : ''}</h1>
        <p style={{ fontSize: 13.5, color: '#62626b', marginBottom: 24 }}>Tell us where you fit in to set up your workspace.</p>

        <form onSubmit={submit}>
          <label style={{ fontSize: 12.5, fontWeight: 700, color: '#62626b', display: 'block', marginBottom: 8 }}>Department</label>
          <select value={dept} onChange={e => setDept(e.target.value)} style={{ width: '100%', border: '1px solid #e2e2e6', background: '#f7f7f9', borderRadius: 11, padding: '13px 14px', fontSize: 14, fontWeight: 600, color: '#1a1a1f', outline: 'none', marginBottom: 22, appearance: 'none', cursor: 'pointer' }}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>

          <label style={{ fontSize: 12.5, fontWeight: 700, color: '#62626b', display: 'block', marginBottom: 8 }}>Position</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
            {POSITIONS.map(p => {
              const on = role === p.value
              return (
                <button type="button" key={p.value} onClick={() => setRole(p.value)} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, border: `1.5px solid ${on ? accent : '#e2e2e6'}`, background: on ? '#eef2ff' : '#f7f7f9', borderRadius: 12, padding: '12px 14px', cursor: 'pointer' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${on ? accent : '#c4c4cc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {on && <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />}
                  </span>
                  <span>
                    <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1a1a1f' }}>{p.label}</span>
                    <span style={{ display: 'block', fontSize: 12, color: '#62626b' }}>{p.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {err && <p style={{ fontSize: 12.5, color: '#dc2626', marginBottom: 14 }}>{err}</p>}

          <button type="submit" disabled={busy} style={{ width: '100%', background: accent, color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: busy ? 0.7 : 1 }}>
            {busy ? 'Setting up…' : 'Enter Orbit'}
          </button>
        </form>
      </div>
    </div>
  )
}

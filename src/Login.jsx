import { useState } from 'react'
import { supabase } from './lib/supabase'

// Shown only in live mode when there's no active session.
export default function Login() {
  const [mode, setMode] = useState('signin')        // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const accent = '#4f46e5'

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
        if (error) throw error
        setMsg('Check your inbox to confirm your email, then sign in.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setMsg(err.message || 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const field = { width: '100%', border: '1px solid #e2e2e6', background: '#f7f7f9', borderRadius: 11, padding: '13px 14px', fontSize: 14, fontWeight: 500, color: '#1a1a1f', outline: 'none', marginBottom: 12 }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ececed', fontFamily: "'Plus Jakarta Sans',sans-serif", padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 22, padding: 28, boxShadow: '0 8px 40px rgba(16,16,20,.12)' }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg,${accent},#6366f1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 18 }}>O</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1f', marginBottom: 4 }}>{mode === 'signup' ? 'Create your account' : 'Welcome to Orbit'}</h1>
        <p style={{ fontSize: 13.5, color: '#62626b', marginBottom: 22 }}>{mode === 'signup' ? 'Join your department workspace.' : 'Sign in to your department workspace.'}</p>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <input style={field} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required />
          )}
          <input style={field} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input style={field} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          <button type="submit" disabled={busy} style={{ width: '100%', background: accent, color: '#fff', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', opacity: busy ? 0.7 : 1 }}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Sign up' : 'Sign in'}
          </button>
        </form>

        {msg && <p style={{ fontSize: 12.5, color: '#62626b', marginTop: 14, lineHeight: 1.5 }}>{msg}</p>}

        <p style={{ fontSize: 13, color: '#62626b', marginTop: 20, textAlign: 'center' }}>
          {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMsg('') }} style={{ border: 'none', background: 'none', color: accent, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            {mode === 'signup' ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}

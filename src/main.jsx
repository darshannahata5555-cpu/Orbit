import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Onboarding from './Onboarding.jsx'
import { AppDataProvider, useAppData } from './data/AppData.jsx'

function Splash({ text = 'Loading Orbit…' }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ececed', color: '#62626b', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 600 }}>
      {text}
    </div>
  )
}

function Root() {
  const { authReady, needsLogin, needsOnboarding, loading, data, error } = useAppData()
  if (!authReady) return <Splash />
  if (needsLogin) return <Login />
  if (error) return <Splash text={`Couldn't load data: ${error}`} />
  if (loading || !data) return <Splash />
  if (needsOnboarding) return <Onboarding />
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppDataProvider>
      <Root />
    </AppDataProvider>
  </StrictMode>,
)

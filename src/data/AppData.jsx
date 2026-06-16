import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import * as api from './api'
import * as mock from './mock'
import { BASE_THREAD } from './mock'

const AppDataContext = createContext(null)
export const useAppData = () => useContext(AppDataContext)

// Demo bundle in the same shape api.fetchAll() returns.
const demoData = {
  user: mock.USER,
  announcements: mock.ANNOUNCEMENTS,
  allTasks: mock.ALL_TASKS,
  homeTasks: mock.HOME_TASKS,
  events: mock.EVENTS,
  finance: mock.FINANCE,
  financeRequests: mock.FINANCE_REQUESTS,
  myClaims: mock.MY_CLAIMS,
  folders: mock.FOLDERS,
  recentFiles: mock.RECENT_FILES,
  conversations: mock.CONVERSATIONS,
}

export function AppDataProvider({ children }) {
  const live = isSupabaseConfigured
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(!live)        // demo needs no auth
  const [me, setMe] = useState(live ? null : mock.USER)
  const [data, setData] = useState(live ? null : demoData)
  const [loading, setLoading] = useState(live)
  const [error, setError] = useState(null)

  // Track the auth session in live mode.
  useEffect(() => {
    if (!live) return
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [live])

  const refresh = useCallback(async () => {
    if (!live) return
    try {
      setLoading(true)
      const user = await api.getCurrentUser()
      setMe(user)
      setData(await api.fetchAll(user))
      setError(null)
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [live])

  useEffect(() => { if (live && session) refresh() }, [live, session, refresh])

  const signOut = useCallback(async () => { if (live) await supabase.auth.signOut() }, [live])

  const actions = {
    async completeOnboarding(payload)  { if (live) { await api.completeOnboarding(payload); await refresh() } },
    async setRequestStatus(id, status) { if (live) { await api.setRequestStatus(id, status); refresh() } },
    async createTask(payload)          { if (live) { await api.createTask(payload, me); refresh() } },
    async submitClaim(payload)         { if (live) { await api.submitClaim(payload, me); refresh() } },
    async sendMessage(cid, body)       { if (live) await api.sendMessage(cid, body, me) },
    async fetchThread(cid)             { return live ? api.fetchThread(cid, me) : BASE_THREAD },
    subscribeToMessages(cid, cb)       { return live ? api.subscribeToMessages(cid, cb) : null },
  }

  const value = {
    live, authReady, session,
    needsLogin: live && !session,
    needsOnboarding: live && !!session && !!me && !me.onboarded,
    me, data, loading, error, refresh, signOut, actions,
  }
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

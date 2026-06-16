// Live data layer. Each function maps Supabase rows to the same shapes
// the UI already expects (see src/data/mock.js), so screens don't care
// where the data came from.
import { supabase } from '../lib/supabase'
import { EVENTS } from './mock'

const fmtTime = iso => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  } catch { return '' }
}
const isDone = s => s === 'Completed' || s === 'Verified'

// ── Reads ────────────────────────────────────────────────────────────
export async function getCurrentUser() {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth?.user) return null
  const { data } = await supabase.from('users').select('*').eq('auth_id', auth.user.id).single()
  return data || { name: auth.user.email, initials: (auth.user.email || '??').slice(0, 2).toUpperCase(), role: 'Member', dept: 'Technicals' }
}

export async function fetchAll(me) {
  const initials = me?.initials
  const [ann, tasks, budget, requests, claims, folders, files, convos] = await Promise.all([
    supabase.from('announcements').select('*').order('created_at', { ascending: false }),
    supabase.from('tasks').select('*, poc:poc_id(initials)').order('created_at'),
    supabase.from('finance_budgets').select('*').eq('dept', me?.dept || 'Technicals').single(),
    supabase.from('finance_requests').select('*, requester:requester_id(name, initials)').order('created_at', { ascending: false }),
    supabase.from('claims').select('*').order('created_at', { ascending: false }),
    supabase.from('folders').select('*'),
    supabase.from('files').select('*').order('created_at', { ascending: false }),
    supabase.from('conversations').select('*, messages(body, kind, created_at)'),
  ])

  const allTasks = (tasks.data || []).map(t => ({
    id: t.id,
    title: t.title,
    status: t.status,
    pr: t.priority,
    due: t.due_label,
    poc: t.poc?.initials || '—',
    dept: t.dept,
    prog: t.progress,
    me: t.poc?.initials === initials,
    cross: t.cross_dept,
    overdue: !isDone(t.status) && t.due_at && new Date(t.due_at) < new Date(),
    dep: t.dependency,
  }))

  const allocated = budget.data?.allocated || 0
  const spent = budget.data?.spent || 0
  const finance = { allocated, spent, remaining: allocated - spent, pending: budget.data?.pending || 0 }

  const fileCount = id => (files.data || []).filter(f => f.folder_id === id).length

  return {
    user: me,
    announcements: (ann.data || []).map(a => ({ tag: a.tag, title: a.title, body: a.body, meta: a.meta })),
    allTasks,
    homeTasks: allTasks.slice(0, 2).map(t => ({ id: t.id, title: t.title, pr: t.pr, due: t.due, poc: t.poc, prog: t.prog })),
    events: EVENTS, // schedule is static demo content
    finance,
    financeRequests: (requests.data || []).map(r => ({
      id: r.id, who: r.requester?.name || 'Member', initials: r.requester?.initials || '—',
      title: r.title, amount: r.amount, category: r.category, date: r.date_label, invoice: r.invoice,
    })),
    myClaims: (claims.data || []).map(c => ({ id: c.id, title: c.title, amount: c.amount, status: c.status, date: c.date_label })),
    folders: (folders.data || []).map(f => ({ id: f.id, name: f.name, kind: f.kind, count: fileCount(f.id) })),
    recentFiles: (files.data || []).slice(0, 5).map(f => ({ name: f.name, type: f.type, size: f.size_label, date: f.date_label, starred: f.starred })),
    conversations: (convos.data || []).map(c => {
      const last = (c.messages || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
      return {
        id: c.id, name: c.name, kind: c.kind,
        sub: last ? (last.kind === 'file' ? '📎 File' : last.kind === 'voice' ? '🎙 Voice message' : last.body) : 'No messages yet',
        time: last ? fmtTime(last.created_at) : '', unread: 0,
        av: c.kind === 'DM' ? c.name.slice(0, 2).toUpperCase() : null,
        channel: c.kind === 'Channel', group: c.kind === 'Group',
      }
    }),
  }
}

export async function fetchThread(conversationId, me) {
  const { data } = await supabase
    .from('messages')
    .select('*, sender:sender_id(initials)')
    .eq('conversation_id', conversationId)
    .order('created_at')
  return (data || []).map(m => ({
    me: m.sender?.initials === me?.initials,
    text: m.body,
    kind: m.kind === 'text' ? undefined : m.kind,
    fname: m.file_name, fsize: m.file_size, dur: m.duration,
    time: fmtTime(m.created_at), read: true,
  }))
}

// ── Writes ───────────────────────────────────────────────────────────
export async function setRequestStatus(id, status) {
  await supabase.from('finance_requests').update({ status }).eq('id', id)
}

export async function createTask({ title, description, priority, dept = 'Technicals', poc_id, due_label }, me) {
  await supabase.from('tasks').insert({
    title, description, priority, dept, poc_id, due_label,
    status: 'Pending', progress: 0, created_by: me?.id,
  })
}

export async function submitClaim({ title, amount, category, date_label }, me) {
  await supabase.from('claims').insert({
    user_id: me?.id, title, amount, category, date_label, status: 'Pending',
  })
}

export async function sendMessage(conversationId, body, me) {
  await supabase.from('messages').insert({
    conversation_id: conversationId, sender_id: me?.id, kind: 'text', body,
  })
}

export function subscribeToMessages(conversationId, onInsert) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      payload => onInsert(payload.new))
    .subscribe()
}

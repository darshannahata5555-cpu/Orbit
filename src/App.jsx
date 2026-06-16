import { useState, useRef } from 'react'
import { useAppData } from './data/AppData'

const LIGHT = {
  bg: '#ececed', surface: '#ffffff', surface2: '#f7f7f9', surface3: '#f1f1f4',
  border: '#ececef', border2: '#e2e2e6',
  text: '#1a1a1f', text2: '#62626b', text3: '#9a9aa3',
  accent: '#4f46e5', accent2: '#6366f1', accentSoft: '#eef2ff', onAccent: '#ffffff',
  green: '#16a34a', greenSoft: '#e9f7ee',
  amber: '#d97706', amberSoft: '#fdf2e3',
  red: '#dc2626', redSoft: '#fdeeee',
  blue: '#2563eb', blueSoft: '#e8f0fe',
  shadow: '0 1px 2px rgba(16,16,20,.04),0 4px 16px rgba(16,16,20,.05)',
  shadowLg: '0 8px 40px rgba(16,16,20,.16)',
}
const DARK = {
  bg: '#000000', surface: '#161618', surface2: '#1d1d20', surface3: '#252529',
  border: '#2a2a30', border2: '#33333a',
  text: '#f4f4f6', text2: '#a0a0aa', text3: '#6e6e78',
  accent: '#6366f1', accent2: '#818cf8', accentSoft: '#1e1b39', onAccent: '#ffffff',
  green: '#34d399', greenSoft: '#0f2e22',
  amber: '#fbbf24', amberSoft: '#332405',
  red: '#f87171', redSoft: '#3a1414',
  blue: '#60a5fa', blueSoft: '#102136',
  shadow: '0 1px 2px rgba(0,0,0,.3),0 4px 16px rgba(0,0,0,.4)',
  shadowLg: '0 8px 40px rgba(0,0,0,.6)',
}

// Demo/live data is provided via useAppData(); see src/data/mock.js and
// src/data/api.js. Only static UI config lives here.
const COMM_HUB = [
  { label: 'Messages', icon: 'M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z', badge: '4', kind: 'blue' },
  { label: 'Dept Chat', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', badge: null, kind: 'accent' },
  { label: 'Groups', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', badge: '3', kind: 'green' },
]
const KANBAN_COLS = [
  { key: 'todo', name: 'To Do', statuses: ['Pending', 'Waiting for Dependency'] },
  { key: 'prog', name: 'In Progress', statuses: ['In Progress'] },
  { key: 'block', name: 'Blocked', statuses: ['Blocked'] },
  { key: 'done', name: 'Done', statuses: ['Completed', 'Verified'] },
]
const FAB_ACTIONS = [
  { label: 'New Task', icon: 'M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', kind: 'newtask' },
  { label: 'New Chat', icon: 'M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z', kind: 'chat' },
  { label: 'Upload File', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12', kind: 'upload' },
  { label: 'Announcement', icon: 'M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6', kind: 'announce' },
]

function inr(n) {
  const s = String(n); let last3 = s.slice(-3); let rest = s.slice(0, -3)
  if (rest) last3 = ',' + last3
  rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return '₹' + rest + last3
}
function prStyle(p, t) {
  if (p === 'High') return [t.red, t.redSoft]
  if (p === 'Medium') return [t.amber, t.amberSoft]
  return [t.green, t.greenSoft]
}
function statusStyle(s, t) {
  const m = { 'Pending': [t.text2, t.surface3], 'In Progress': [t.blue, t.blueSoft], 'Waiting for Dependency': [t.amber, t.amberSoft], 'Blocked': [t.red, t.redSoft], 'Completed': [t.green, t.greenSoft], 'Verified': [t.accent, t.accentSoft] }
  return m[s] || [t.text2, t.surface3]
}
function claimStyle(s, t) {
  const m = { 'Pending': [t.amber, t.amberSoft], 'Approved': [t.blue, t.blueSoft], 'Rejected': [t.red, t.redSoft], 'Reimbursed': [t.green, t.greenSoft] }
  return m[s] || [t.amber, t.amberSoft]
}
function tagStyle(tag, t) {
  if (tag === 'Urgent') return [t.red, t.redSoft]
  if (tag === 'Dept') return [t.accent, t.accentSoft]
  return [t.blue, t.blueSoft]
}
function kc(k, t) { return ({ accent: t.accent, blue: t.blue, green: t.green, amber: t.amber, red: t.red })[k] || t.accent }
function ks(k, t) { return ({ accent: t.accentSoft, blue: t.blueSoft, green: t.greenSoft, amber: t.amberSoft, red: t.redSoft })[k] || t.accentSoft }
function fileTypeStyle(type, t) {
  const m = { 'PDF': [t.red, t.redSoft], 'XLS': [t.green, t.greenSoft], 'DOC': [t.blue, t.blueSoft], 'IMG': [t.amber, t.amberSoft] }
  return m[type] || [t.text2, t.surface3]
}
function searchTypeStyle(type, t) {
  const m = {
    'People': [t.accent, t.accentSoft, 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8'],
    'Tasks': [t.blue, t.blueSoft, 'M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
    'Files': [t.green, t.greenSoft, 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM13 2v7h7'],
    'Messages': [t.amber, t.amberSoft, 'M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z'],
    'Announcements': [t.red, t.redSoft, 'M3 11l18-5v12L3 14v-3z'],
  }
  return m[type] || m['Files']
}
function filterTasks(tasks, tab) {
  if (tab === 'me') return tasks.filter(x => x.me)
  if (tab === 'dept') return tasks.filter(x => x.dept === 'Technicals')
  if (tab === 'cross') return tasks.filter(x => x.cross)
  if (tab === 'completed') return tasks.filter(x => x.status === 'Completed' || x.status === 'Verified')
  if (tab === 'overdue') return tasks.filter(x => x.overdue)
  return tasks
}

function Ic({ d, size = 18, color = 'currentColor', sw = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {d.split(/(?=M)/).filter(Boolean).map((seg, i) => <path key={i} d={seg.trim()} />)}
    </svg>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)
  const [tab, setTab] = useState('home')
  const [fabOpen, setFabOpen] = useState(false)
  const [taskView, setTaskView] = useState('list')
  const [taskTab, setTaskTab] = useState('me')
  const [modal, setModal] = useState(null)
  const [chatView, setChatView] = useState('list')
  const [activeChat, setActiveChat] = useState(null)
  const [draft, setDraft] = useState('')
  const [extraMsgs, setExtraMsgs] = useState([])
  const [reqStatus, setReqStatus] = useState({})
  const [toast, setToast] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [formPr, setFormPr] = useState('Medium')
  const [formCat, setFormCat] = useState('Equipment')
  const [formTitle, setFormTitle] = useState('')
  const [claimTitle, setClaimTitle] = useState('')
  const [claimAmount, setClaimAmount] = useState('')
  const [baseThread, setBaseThread] = useState([])
  const toastRef = useRef(null)
  const t = dark ? DARK : LIGHT
  const Empty = ({ text }) => <div style={{ fontSize: 12.5, color: t.text3, fontWeight: 600, padding: '20px 2px', textAlign: 'center', width: '100%' }}>{text}</div>

  // Data + actions resolve to Supabase when configured, else demo data.
  const { live, data, actions, signOut } = useAppData()
  const USER = data.user
  const ANNOUNCEMENTS = data.announcements
  const HOME_TASKS = data.homeTasks
  const EVENTS = data.events
  const ALL_TASKS = data.allTasks
  const FINANCE = data.finance
  const FINANCE_REQUESTS = data.financeRequests
  const MY_CLAIMS = data.myClaims
  const FOLDERS = data.folders
  const RECENT_FILES = data.recentFiles
  const CONVERSATIONS = data.conversations
  const SEARCH_ITEMS = [
    ...ALL_TASKS.map(x => ({ type: 'Tasks', name: x.title, sub: `${x.status} · ${x.pr} · ${x.due}`, av: null })),
    ...RECENT_FILES.map(x => ({ type: 'Files', name: x.name, sub: `${x.size} · ${x.type} · ${x.date}`, av: null })),
    ...ANNOUNCEMENTS.map(x => ({ type: 'Announcements', name: x.title, sub: x.meta, av: null })),
  ]

  function showToast(msg) {
    setToast(msg); clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(null), 2200)
  }
  function go(newTab) { setTab(newTab); setFabOpen(false) }
  function setReq(id, status, msg) { setReqStatus(prev => ({ ...prev, [id]: status })); showToast(msg); actions.setRequestStatus(id, status) }
  async function openThread(c) {
    setActiveChat(c); setChatView('thread'); setExtraMsgs([]); setBaseThread([])
    setBaseThread(await actions.fetchThread(c.id))
  }
  function backToList() { setChatView('list'); setActiveChat(null) }
  function sendMsg() {
    const d = draft.trim(); if (!d) return
    setExtraMsgs(prev => [...prev, { me: true, text: d, time: 'now', read: false }]); setDraft('')
    if (live) actions.sendMessage(activeChat.id, d)
  }
  function handleFab(kind) {
    if (kind === 'newtask') { setFabOpen(false); setTab('tasks'); setModal('newtask') }
    else if (kind === 'chat') { setFabOpen(false); setTab('chat'); setChatView('list') }
    else if (kind === 'upload') { setFabOpen(false); setTab('files') }
    else setFabOpen(false)
  }

  const isThread = tab === 'chat' && chatView === 'thread'
  const showChrome = !isThread

  const calDow = ['S','M','T','W','T','F','S']
  const calDots = { 12: t.green, 14: t.green, 15: t.red, 16: t.accent, 17: t.red, 18: t.amber, 19: t.blue }
  const calDays = []
  for (let i = 0; i < 7; i++) calDays.push({ n: '', bg: 'transparent', color: 'transparent', dot: 'transparent' })
  for (let n = 1; n <= 30; n++) {
    const today = n === 16
    calDays.push({ n: String(n), bg: today ? t.accent : 'transparent', color: today ? '#fff' : t.text, dot: calDots[n] && !today ? calDots[n] : (today ? 'rgba(255,255,255,.7)' : 'transparent') })
  }

  const tasksList = filterTasks(ALL_TASKS, taskTab)
  const kanban = KANBAN_COLS.map(col => ({ ...col, count: ALL_TASKS.filter(x => col.statuses.includes(x.status)).length, tasks: ALL_TASKS.filter(x => col.statuses.includes(x.status)) }))
  const spentPct = Math.round(FINANCE.spent / FINANCE.allocated * 100)
  const finReqs = FINANCE_REQUESTS.map(r => { const st = reqStatus[r.id] || 'Pending'; const [col, bg] = claimStyle(st, t); return { ...r, amountF: inr(r.amount), status: st, isPending: st === 'Pending', statusColor: col, statusBg: bg } })
  const pendingCount = finReqs.filter(r => r.isPending).length
  const searchResults = SEARCH_ITEMS.filter(x => (filter === 'All' || x.type === filter) && (!query.trim() || x.name.toLowerCase().includes(query.toLowerCase()) || x.sub.toLowerCase().includes(query.toLowerCase())))
  const thread = [...baseThread, ...extraMsgs]

  const sh = { card: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 14, boxShadow: t.shadow } }
  const hdr = { background: t.surface, position: 'sticky', top: 0, zIndex: 5, borderBottom: `1px solid ${t.border}` }

  return (
    <div style={{ height: '100dvh', background: t.bg, display: 'flex', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans',sans-serif", overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: 430, background: t.surface, position: 'relative', display: 'flex', flexDirection: 'column', height: '100dvh', boxShadow: '0 0 80px rgba(0,0,0,.08)', overflow: 'hidden' }}>

        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: t.bg, paddingBottom: 148, scrollbarWidth: 'none' }}>

          {/* ═══ HOME ═══ */}
          {tab === 'home' && (
            <div style={{ animation: 'obFade .25s ease' }}>
              <header style={{ ...hdr, padding: '18px 20px 16px', display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},${t.accent2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{USER.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: t.text3, fontWeight: 500, lineHeight: 1.2 }}>Good evening</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{USER.name}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: t.accent, background: t.accentSoft, padding: '2px 7px', borderRadius: 6 }}>{USER.role} · {USER.dept}</span>
                  </div>
                </div>
                <button onClick={() => setDark(d => !d)} style={{ width: 38, height: 38, borderRadius: 11, border: `1px solid ${t.border}`, background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Ic size={18} color={t.text2} d={dark ? 'M12 3v1M12 20v1M4.2 4.2l.7.7M19.1 19.1l.7.7M3 12h1M20 12h1M4.2 19.8l.7-.7M19.1 4.9l.7-.7M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8' : 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z'} />
                </button>
                <button onClick={() => {}} style={{ width: 38, height: 38, borderRadius: 11, border: `1px solid ${t.border}`, background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                  <Ic size={18} color={t.text2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </button>
                {live && (
                  <button onClick={signOut} title="Sign out" style={{ width: 38, height: 38, borderRadius: 11, border: `1px solid ${t.border}`, background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Ic size={18} color={t.text2} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </button>
                )}
              </header>

              <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Announcements */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Announcements</h2>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: t.accent, cursor: 'pointer' }}>See all</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -20px', padding: '2px 20px', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
                    {ANNOUNCEMENTS.length === 0 && <Empty text="No announcements yet" />}
                    {ANNOUNCEMENTS.map((a, i) => {
                      const [tc, bg] = tagStyle(a.tag, t)
                      return (
                        <div key={i} style={{ scrollSnapAlign: 'start', flex: '0 0 86%', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16, boxShadow: t.shadow }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.02em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6, color: tc, background: bg }}>{a.tag}</span>
                            <span style={{ fontSize: 11.5, color: t.text3, fontWeight: 500 }}>{a.meta}</span>
                          </div>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: t.text, lineHeight: 1.35, marginBottom: 6 }}>{a.title}</div>
                          <div style={{ fontSize: 12.5, color: t.text2, lineHeight: 1.5 }}>{a.body}</div>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Communication Hub */}
                <section>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 12 }}>Communication</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                    {COMM_HUB.map((c, i) => (
                      <button key={i} onClick={() => go('chat')} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, cursor: 'pointer', boxShadow: t.shadow }}>
                        <div style={{ width: 38, height: 38, borderRadius: 11, background: ks(c.kind, t), display: 'flex', alignItems: 'center', justifyContent: 'center', color: kc(c.kind, t), position: 'relative' }}>
                          <Ic size={19} color={kc(c.kind, t)} d={c.icon} />
                          {c.badge && <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 17, height: 17, padding: '0 4px', borderRadius: 9, background: t.accent, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.badge}</span>}
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 600, color: t.text }}>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Upcoming Tasks */}
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Upcoming Tasks</h2>
                    <span onClick={() => go('tasks')} style={{ fontSize: 12.5, fontWeight: 600, color: t.accent, cursor: 'pointer' }}>View all</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {HOME_TASKS.length === 0 && <Empty text="No upcoming tasks" />}
                    {HOME_TASKS.map((task, i) => {
                      const [pc, pb] = prStyle(task.pr, t)
                      return (
                        <div key={i} style={{ ...sh.card }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 11 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: t.text, lineHeight: 1.35 }}>{task.title}</span>
                            <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, color: pc, background: pb }}>{task.pr}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 11 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: t.text2, fontWeight: 500 }}>
                              <Ic size={13} color={t.text2} d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2" />
                              {task.due}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: t.text2, fontWeight: 500 }}>
                              <span style={{ width: 18, height: 18, borderRadius: '50%', background: t.accentSoft, color: t.accent, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{task.poc}</span>POC
                            </span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: t.surface3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, background: t.accent, width: task.prog + '%' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Today */}
                <section style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Today</h2>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: t.text3 }}>Tue, 16 Jun</span>
                  </div>
                  <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '6px 16px', boxShadow: t.shadow }}>
                    {EVENTS.length === 0 && <Empty text="Nothing scheduled today" />}
                    {EVENTS.map((e, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: `1px solid ${i < EVENTS.length - 1 ? t.border : 'transparent'}` }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: t.text2, width: 48, flexShrink: 0 }}>{e.time}</div>
                        <div style={{ width: 3, height: 28, borderRadius: 2, background: kc(e.kind, t), flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{e.title}</div>
                          <div style={{ fontSize: 11.5, color: t.text3, fontWeight: 500 }}>{e.dept}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ═══ TASKS ═══ */}
          {tab === 'tasks' && (
            <div style={{ animation: 'obFade .25s ease' }}>
              <header style={{ ...hdr, padding: '18px 20px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: '-.01em' }}>Tasks</div>
                    <div style={{ fontSize: 12.5, color: t.text3, fontWeight: 500 }}>{tasksList.length} tasks · HOD can create</div>
                  </div>
                  <button onClick={() => setModal('newtask')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: t.accent, color: '#fff', border: 'none', borderRadius: 11, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    <Ic size={15} color="#fff" sw={2.4} d="M12 5v14M5 12h14" /> New
                  </button>
                </div>
                <div style={{ display: 'flex', background: t.surface3, borderRadius: 11, padding: 3, gap: 2 }}>
                  {[['list','List'],['kanban','Board'],['calendar','Calendar']].map(([v, label]) => (
                    <button key={v} onClick={() => setTaskView(v)} style={{ flex: 1, border: 'none', borderRadius: 8, padding: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', color: taskView === v ? t.text : t.text2, background: taskView === v ? t.surface : 'transparent', boxShadow: taskView === v ? t.shadow : 'none' }}>{label}</button>
                  ))}
                </div>
              </header>

              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 20px 4px', scrollbarWidth: 'none' }}>
                {[{key:'me',label:'Assigned to Me'},{key:'dept',label:'Department'},{key:'cross',label:'Cross-Dept'},{key:'completed',label:'Completed'},{key:'overdue',label:'Overdue'}].map(tb => (
                  <button key={tb.key} onClick={() => setTaskTab(tb.key)} style={{ flexShrink: 0, border: `1px solid ${taskTab === tb.key ? t.accent : t.border}`, background: taskTab === tb.key ? t.accent : t.surface, color: taskTab === tb.key ? '#fff' : t.text2, borderRadius: 9, padding: '7px 13px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{tb.label}</button>
                ))}
              </div>

              {taskView === 'list' && (
                <div style={{ padding: '8px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {tasksList.length === 0 && <Empty text="No tasks here yet" />}
                  {tasksList.map(task => {
                    const [sc, sb] = statusStyle(task.status, t); const [pc, pb] = prStyle(task.pr, t)
                    return (
                      <div key={task.id} style={{ ...sh.card }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, color: sc, background: sb }}>{task.status}</span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, color: pc, background: pb }}>{task.pr}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: t.text3 }}>{task.dept}</span>
                        </div>
                        <div style={{ fontSize: 14.5, fontWeight: 600, color: t.text, lineHeight: 1.35, marginBottom: 11 }}>{task.title}</div>
                        {task.dep && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: t.amber, background: t.amberSoft, padding: '4px 8px', borderRadius: 7, marginBottom: 11 }}>
                            <Ic size={12} color={t.amber} sw={2.2} d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8" />
                            Depends on {task.dep}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: t.text2, fontWeight: 500 }}>
                            <Ic size={13} color={t.text2} d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2" />{task.due}
                          </span>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: t.accentSoft, color: t.accent, fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{task.poc}</span>
                          <div style={{ flex: 1, height: 6, borderRadius: 3, background: t.surface3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, background: t.accent, width: task.prog + '%' }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {taskView === 'kanban' && (
                <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '8px 20px 0', alignItems: 'flex-start', scrollbarWidth: 'none' }}>
                  {kanban.map(col => (
                    <div key={col.key} style={{ flexShrink: 0, width: 250 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, padding: '0 2px' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{col.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.text3, background: t.surface3, minWidth: 20, textAlign: 'center', borderRadius: 6, padding: '1px 6px' }}>{col.count}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {col.tasks.map(task => {
                          const [pc] = prStyle(task.pr, t)
                          return (
                            <div key={task.id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: 12, boxShadow: t.shadow }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: pc }} />
                                <span style={{ fontSize: 10.5, fontWeight: 600, color: t.text3 }}>{task.due}</span>
                                <span style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: t.accentSoft, color: t.accent, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{task.poc}</span>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.35 }}>{task.title}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {taskView === 'calendar' && (
                <div style={{ padding: '8px 20px 0' }}>
                  <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16, boxShadow: t.shadow, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>June 2026</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {['m15 18-6-6 6-6','m9 18 6-6-6-6'].map((d, i) => (
                          <span key={i} style={{ width: 28, height: 28, borderRadius: 8, background: t.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.text2, cursor: 'pointer' }}>
                            <Ic size={14} color={t.text2} sw={2.4} d={d} />
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
                      {calDow.map((d, i) => <span key={i} style={{ fontSize: 10, fontWeight: 700, color: t.text3, padding: '4px 0' }}>{d}</span>)}
                      {calDays.map((d, i) => (
                        <div key={i} style={{ aspectRatio: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 9, background: d.bg }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: d.color }}>{d.n}</span>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: d.dot }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 10, padding: '0 2px' }}>Deadlines this week</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {tasksList.slice(0, 4).map(task => {
                      const [pc] = prStyle(task.pr, t); const [sc, sb] = statusStyle(task.status, t)
                      return (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '12px 14px', boxShadow: t.shadow }}>
                          <div style={{ width: 3, height: 32, borderRadius: 2, background: pc }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{task.title}</div>
                            <div style={{ fontSize: 11.5, color: t.text3, fontWeight: 500 }}>{task.due} · {task.poc}</div>
                          </div>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, color: sc, background: sb }}>{task.status}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ FINANCE ═══ */}
          {tab === 'finance' && (
            <div style={{ animation: 'obFade .25s ease' }}>
              <header style={{ ...hdr, padding: '18px 20px 16px' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: '-.01em' }}>Finance</div>
                <div style={{ fontSize: 12.5, color: t.text3, fontWeight: 500 }}>Technicals · HOD dashboard</div>
              </header>
              <div style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ background: t.accent, borderRadius: 18, padding: 20, color: '#fff', boxShadow: '0 8px 24px rgba(79,70,229,.28)' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, opacity: .85, marginBottom: 4 }}>Remaining budget</div>
                  <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 16 }}>{inr(FINANCE.remaining)}</div>
                  <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,.25)', overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ height: '100%', borderRadius: 4, background: '#fff', width: spentPct + '%' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, opacity: .9 }}>
                    <span>Spent {inr(FINANCE.spent)}</span><span>of {inr(FINANCE.allocated)}</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
                  {[{label:'Allocated',val:inr(FINANCE.allocated),color:t.text},{label:'Spent',val:inr(FINANCE.spent),color:t.text},{label:'Pending claims',val:inr(FINANCE.pending),color:t.amber},{label:'Awaiting you',val:`${pendingCount} requests`,color:t.accent}].map((s, i) => (
                    <div key={i} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 14, boxShadow: t.shadow }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: t.text3, marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <section>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 12 }}>Reimbursement requests</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                    {finReqs.length === 0 && <Empty text="No reimbursement requests" />}
                    {finReqs.map(r => (
                      <div key={r.id} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 14, boxShadow: t.shadow }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.surface3, color: t.text2, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, lineHeight: 1.3 }}>{r.title}</div>
                            <div style={{ fontSize: 11.5, color: t.text3, fontWeight: 500 }}>{r.who} · {r.category} · {r.date}</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 800, color: t.text }}>{r.amountF}</div>
                            <div style={{ fontSize: 10, fontWeight: 600, color: t.text3 }}>{r.invoice}</div>
                          </div>
                        </div>
                        {r.isPending ? (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setReq(r.id, 'Approved', 'Approved · sent to Finance team')} style={{ flex: 1, background: t.green, color: '#fff', border: 'none', borderRadius: 9, padding: 9, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                            <button onClick={() => setReq(r.id, 'Rejected', 'Request rejected')} style={{ flex: 1, background: t.redSoft, color: t.red, border: 'none', borderRadius: 9, padding: 9, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Reject</button>
                            <button onClick={() => setReq(r.id, 'Pending', `Changes requested from ${r.who.split(' ')[0]}`)} style={{ background: t.surface3, color: t.text2, border: 'none', borderRadius: 9, padding: '9px 12px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>Changes</button>
                          </div>
                        ) : (
                          <span style={{ display: 'inline-block', fontSize: 10.5, fontWeight: 700, padding: '3px 9px', borderRadius: 6, color: r.statusColor, background: r.statusBg }}>{r.status}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
                <section style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text }}>My reimbursements</h2>
                    <button onClick={() => setModal('reimburse')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: t.accentSoft, color: t.accent, border: 'none', borderRadius: 9, padding: '7px 11px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      <Ic size={13} color={t.accent} sw={2.4} d="M12 5v14M5 12h14" />Claim
                    </button>
                  </div>
                  <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '4px 14px', boxShadow: t.shadow }}>
                    {MY_CLAIMS.length === 0 && <Empty text="No claims yet" />}
                    {MY_CLAIMS.map((c, i) => {
                      const [sc, sb] = claimStyle(c.status, t)
                      return (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: `1px solid ${i < MY_CLAIMS.length - 1 ? t.border : 'transparent'}` }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>{c.title}</div>
                            <div style={{ fontSize: 11.5, color: t.text3, fontWeight: 500 }}>{c.date}</div>
                          </div>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, color: sc, background: sb }}>{c.status}</span>
                          <div style={{ fontSize: 14, fontWeight: 800, color: t.text, minWidth: 64, textAlign: 'right' }}>{inr(c.amount)}</div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ═══ FILES ═══ */}
          {tab === 'files' && (
            <div style={{ animation: 'obFade .25s ease' }}>
              <header style={{ ...hdr, padding: '18px 20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: '-.01em' }}>Files</div>
                    <div style={{ fontSize: 12.5, color: t.text3, fontWeight: 500 }}>164 files · 5 folders</div>
                  </div>
                  <button onClick={() => showToast('Upload sheet — pick a file')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: t.accent, color: '#fff', border: 'none', borderRadius: 11, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    <Ic size={15} color="#fff" sw={2.2} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />Upload
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: t.surface3, borderRadius: 11, padding: '10px 13px' }}>
                  <Ic size={16} color={t.text3} d="M11 4a7 7 0 1 0 0 14A7 7 0 0 0 11 4zM20 20l-3.5-3.5" />
                  <span style={{ fontSize: 13.5, color: t.text3, fontWeight: 500 }}>Search files, tags…</span>
                </div>
              </header>
              <div style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
                <section>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 12 }}>Folders</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
                    {FOLDERS.length === 0 && <Empty text="No folders yet" />}
                    {FOLDERS.map((f, i) => (
                      <button key={i} style={{ textAlign: 'left', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 14, boxShadow: t.shadow, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: ks(f.kind, t), display: 'flex', alignItems: 'center', justifyContent: 'center', color: kc(f.kind, t), flexShrink: 0 }}>
                          <Ic size={20} color={kc(f.kind, t)} d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h7A1.5 1.5 0 0 1 19 10v7.5A1.5 1.5 0 0 1 17.5 19h-13A1.5 1.5 0 0 1 3 17.5z" />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, lineHeight: 1.25 }}>{f.name}</div>
                          <div style={{ fontSize: 11.5, color: t.text3, fontWeight: 500 }}>{f.count} items</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
                <section style={{ marginBottom: 8 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 12 }}>Recent</h2>
                  <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '4px 14px', boxShadow: t.shadow }}>
                    {RECENT_FILES.length === 0 && <Empty text="No files yet" />}
                    {RECENT_FILES.map((f, i) => {
                      const [fc, fb] = fileTypeStyle(f.type, t)
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${i < RECENT_FILES.length - 1 ? t.border : 'transparent'}` }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: fb, display: 'flex', alignItems: 'center', justifyContent: 'center', color: fc, flexShrink: 0, fontSize: 10, fontWeight: 800, letterSpacing: '.02em' }}>{f.type}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                            <div style={{ fontSize: 11.5, color: t.text3, fontWeight: 500 }}>{f.size} · {f.date}</div>
                          </div>
                          <svg width={17} height={17} viewBox="0 0 24 24" fill={f.starred ? t.amber : 'none'} stroke={f.starred ? t.amber : t.text3} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <path d="M12 3l2.9 5.9 6.6.9-4.7 4.6 1.1 6.5L12 18.8 6.1 21.9l1.1-6.5L2.5 9.8l6.6-.9z" />
                          </svg>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ═══ SEARCH ═══ */}
          {tab === 'search' && (
            <div style={{ animation: 'obFade .25s ease' }}>
              <header style={{ ...hdr, padding: '18px 20px 14px' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: '-.01em', marginBottom: 14 }}>Search</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: t.surface3, borderRadius: 11, padding: '11px 13px' }}>
                  <Ic size={17} color={t.text3} d="M11 4a7 7 0 1 0 0 14A7 7 0 0 0 11 4zM20 20l-3.5-3.5" />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people, tasks, files…" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, fontWeight: 500, color: t.text }} />
                </div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 13, scrollbarWidth: 'none' }}>
                  {['All','People','Tasks','Files','Messages'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, border: `1px solid ${filter === f ? t.accent : t.border}`, background: filter === f ? t.accent : t.surface, color: filter === f ? '#fff' : t.text2, borderRadius: 9, padding: '6px 13px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{f}</button>
                  ))}
                </div>
              </header>
              <div style={{ padding: '16px 20px 0' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: t.text3, marginBottom: 12 }}>{searchResults.length} results</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {searchResults.map((r, i) => {
                    const [rc, rb, ri] = searchTypeStyle(r.type, t)
                    return (
                      <button key={i} style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 13, padding: '13px 14px', boxShadow: t.shadow, cursor: 'pointer' }}>
                        {r.av ? (
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.accentSoft, color: t.accent, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.av}</div>
                        ) : (
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: rb, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic size={18} color={rc} d={ri} /></div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                          <div style={{ fontSize: 11.5, color: t.text3, fontWeight: 500 }}>{r.type} · {r.sub}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══ CHAT LIST ═══ */}
          {tab === 'chat' && chatView === 'list' && (
            <div style={{ animation: 'obFade .25s ease' }}>
              <header style={{ ...hdr, padding: '18px 20px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: '-.01em' }}>Messages</div>
                  <button onClick={() => go('home')} style={{ width: 36, height: 36, borderRadius: 11, border: `1px solid ${t.border}`, background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Ic size={17} color={t.text2} sw={2.2} d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: t.surface3, borderRadius: 11, padding: '10px 13px' }}>
                  <Ic size={16} color={t.text3} d="M11 4a7 7 0 1 0 0 14A7 7 0 0 0 11 4zM20 20l-3.5-3.5" />
                  <span style={{ fontSize: 13.5, color: t.text3, fontWeight: 500 }}>Message anyone in Orbit…</span>
                </div>
              </header>
              <div style={{ padding: '6px 20px 0' }}>
                {CONVERSATIONS.length === 0 && <Empty text="No conversations yet" />}
                {CONVERSATIONS.map(c => (
                  <button key={c.id} onClick={() => openThread(c)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', border: 'none', borderBottom: `1px solid ${t.border}`, background: 'transparent', cursor: 'pointer' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      {c.av && <div style={{ width: 46, height: 46, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},${t.accent2})`, color: '#fff', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.av}</div>}
                      {c.channel && <div style={{ width: 46, height: 46, borderRadius: 14, background: t.accentSoft, color: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={20} color={t.accent} d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></div>}
                      {c.group && <div style={{ width: 46, height: 46, borderRadius: '50%', background: t.greenSoft, color: t.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={22} color={t.green} d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></div>}
                      {c.online && <span style={{ position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: '50%', background: t.green, border: `2.5px solid ${t.surface}` }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 14.5, fontWeight: 700, color: t.text }}>{c.name}</span>
                        <span style={{ fontSize: 11, color: t.text3, fontWeight: 500, flexShrink: 0 }}>{c.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 12.5, color: c.typing ? t.accent : t.text2, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.sub}</span>
                        {c.unread > 0 && <span style={{ flexShrink: 0, minWidth: 19, height: 19, padding: '0 5px', borderRadius: 10, background: t.accent, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* ═══ CHAT THREAD OVERLAY ═══ */}
        {isThread && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 24, background: t.bg, display: 'flex', flexDirection: 'column', animation: 'obFade .2s ease' }}>
            <header style={{ background: t.surface, padding: '16px 16px 14px', display: 'flex', alignItems: 'center', gap: 11, borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
              <button onClick={backToList} style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Ic size={20} color={t.text} sw={2.2} d="m15 18-6-6 6-6" />
              </button>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg,${t.accent},${t.accent2})`, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {activeChat ? (activeChat.av || activeChat.name.slice(0,2).toUpperCase()) : '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{activeChat?.name}</div>
                <div style={{ fontSize: 11.5, color: t.accent, fontWeight: 600 }}>{activeChat?.typing ? 'typing…' : activeChat?.online ? 'Online' : 'Last seen recently'}</div>
              </div>
              <button style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: t.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Ic size={18} color={t.text2} d="M15.05 5a7 7 0 0 1 0 14M19 12h.01M5 12a7 7 0 0 1 7-7v14a7 7 0 0 1-7-7z" />
              </button>
            </header>
            <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12, scrollbarWidth: 'none' }}>
              <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: t.text3, background: t.surface3, alignSelf: 'center', padding: '4px 12px', borderRadius: 8 }}>Today</div>
              {thread.map((m, i) => {
                const me = m.me
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: me ? 'flex-end' : 'flex-start', maxWidth: '80%', alignSelf: me ? 'flex-end' : 'flex-start' }}>
                    {!m.kind && (
                      <div style={{ background: me ? t.accent : t.surface, color: me ? '#fff' : t.text, border: `1px solid ${me ? 'transparent' : t.border}`, borderRadius: me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 13px', fontSize: 13.5, lineHeight: 1.45, fontWeight: 500, boxShadow: t.shadow, position: 'relative' }}>
                        {m.text}
                        {m.reaction && <span style={{ position: 'absolute', bottom: -11, right: 6, fontSize: 13, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: '1px 5px', lineHeight: 1, boxShadow: t.shadow }}>{m.reaction}</span>}
                      </div>
                    )}
                    {m.kind === 'file' && (
                      <div style={{ background: t.accent, borderRadius: me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: t.shadow, minWidth: 200 }}>
                        <span style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800 }}>PDF</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.fname}</div>
                          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>{m.fsize}</div>
                        </div>
                      </div>
                    )}
                    {m.kind === 'voice' && (
                      <div style={{ background: me ? t.accent : t.surface, color: me ? '#fff' : t.text, border: `1px solid ${me ? 'transparent' : t.border}`, borderRadius: me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: t.shadow, minWidth: 170 }}>
                        <span style={{ width: 30, height: 30, borderRadius: '50%', background: t.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: 22 }}>
                          <span style={{ flex: 1, height: 2, background: 'currentColor', opacity: .4, borderRadius: 1 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, opacity: .8 }}>{m.dur}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, padding: '0 2px' }}>
                      <span style={{ fontSize: 10, color: t.text3, fontWeight: 500 }}>{m.time}</span>
                      {me && m.read && (
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                          <path d="m1 12 5 5L16 7M11 17 22 6"/>
                        </svg>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ flexShrink: 0, background: t.surface, borderTop: `1px solid ${t.border}`, padding: '12px 14px 26px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <button style={{ width: 38, height: 38, borderRadius: '50%', border: 'none', background: t.surface3, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Ic size={19} color={t.text2} sw={2.2} d="M12 5v14M5 12h14" />
              </button>
              <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Message…" style={{ flex: 1, border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 20, padding: '10px 16px', fontSize: 14, fontWeight: 500, color: t.text, outline: 'none' }} />
              <button onClick={sendMsg} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Ic size={19} color="#fff" sw={2.2} d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
              </button>
            </div>
          </div>
        )}

        {/* ═══ FAB MENU ═══ */}
        {fabOpen && (
          <>
            <div onClick={() => setFabOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,14,.45)', zIndex: 28, animation: 'obScrim .2s ease' }} />
            <div style={{ position: 'absolute', right: 18, bottom: 150, zIndex: 29, display: 'flex', flexDirection: 'column', gap: 11, alignItems: 'flex-end' }}>
              {FAB_ACTIONS.map((f, i) => (
                <button key={i} onClick={() => handleFab(f.kind)} style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', background: 'transparent', border: 'none', animation: `obPop .2s ease ${i * 0.04}s backwards` }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: 'rgba(20,20,28,.8)', padding: '7px 12px', borderRadius: 9, backdropFilter: 'blur(4px)' }}>{f.label}</span>
                  <span style={{ width: 46, height: 46, borderRadius: 14, background: t.surface, boxShadow: t.shadowLg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ic size={20} color={t.accent} d={f.icon} />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ═══ MODAL ═══ */}
        {modal && (
          <>
            <div onClick={() => setModal(null)} style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(10,10,14,.5)', animation: 'obScrim .2s ease' }} />
            {modal === 'newtask' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51, background: t.surface, borderRadius: '24px 24px 0 0', maxHeight: '90%', overflowY: 'auto', animation: 'obSheet .28s cubic-bezier(.22,1,.36,1)', scrollbarWidth: 'none' }}>
                <div style={{ position: 'sticky', top: 0, background: t.surface, padding: '16px 20px 12px', borderBottom: `1px solid ${t.border}`, zIndex: 2 }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: t.border2, margin: '0 auto 14px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: t.text }}>New Task</span>
                    <button onClick={() => setModal(null)} style={{ width: 30, height: 30, borderRadius: 9, border: 'none', background: t.surface3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Ic size={16} color={t.text2} sw={2.4} d="M18 6 6 18M6 6l12 12" />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '18px 20px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Title</div><input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g. Finalize stage backdrop" style={{ width: '100%', border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '12px 14px', fontSize: 14, fontWeight: 500, color: t.text, outline: 'none' }} /></div>
                  <div><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Description</div><textarea rows={3} placeholder="Add details, context, links…" style={{ width: '100%', border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '12px 14px', fontSize: 14, fontWeight: 500, color: t.text, outline: 'none', resize: 'none' }} /></div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Priority</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['Low','Medium','High'].map(p => { const on = formPr === p; const [pc, pb] = prStyle(p, t); return <button key={p} onClick={() => setFormPr(p)} style={{ flex: 1, border: `1px solid ${on ? pc : t.border}`, background: on ? pb : t.surface2, color: on ? pc : t.text2, borderRadius: 10, padding: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>{p}</button> })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Deadline</div><div style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '12px 14px' }}><Ic size={15} color={t.text3} d="M3 4h18v18H3zM16 2v4M8 2v4M3 10h18" /><span style={{ fontSize: 13.5, color: t.text, fontWeight: 500 }}>18 Jun, 5 PM</span></div></div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Assign POC</div><div style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '9px 12px' }}><span style={{ width: 24, height: 24, borderRadius: '50%', background: t.accentSoft, color: t.accent, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SD</span><span style={{ fontSize: 13.5, color: t.text, fontWeight: 500 }}>Sana D.</span></div></div>
                  </div>
                  <div><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Dependency Department</div><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '12px 14px' }}><span style={{ fontSize: 13.5, color: t.text, fontWeight: 500 }}>Creatives PR & M</span><Ic size={16} color={t.text3} d="m6 9 6 6 6-6" /></div></div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[{label:'Attach',icon:'m21.4 11.1-8.5 8.5a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.9-7.8'},{label:'Checklist',icon:'M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'}].map((b, i) => (
                      <button key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: `1px dashed ${t.border2}`, background: 'transparent', borderRadius: 11, padding: 11, fontSize: 13, fontWeight: 600, color: t.text2, cursor: 'pointer' }}><Ic size={15} color={t.text2} d={b.icon} />{b.label}</button>
                    ))}
                  </div>
                  <button onClick={() => { actions.createTask({ title: formTitle || 'Untitled task', priority: formPr }); setFormTitle(''); setModal(null); setTab('tasks'); showToast('Task created & assigned') }} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: 13, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 2 }}>Create Task</button>
                </div>
              </div>
            )}
            {modal === 'reimburse' && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51, background: t.surface, borderRadius: '24px 24px 0 0', maxHeight: '90%', overflowY: 'auto', animation: 'obSheet .28s cubic-bezier(.22,1,.36,1)', scrollbarWidth: 'none' }}>
                <div style={{ position: 'sticky', top: 0, background: t.surface, padding: '16px 20px 12px', borderBottom: `1px solid ${t.border}`, zIndex: 2 }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: t.border2, margin: '0 auto 14px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: t.text }}>New Reimbursement</span>
                    <button onClick={() => setModal(null)} style={{ width: 30, height: 30, borderRadius: 9, border: 'none', background: t.surface3, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Ic size={16} color={t.text2} sw={2.4} d="M18 6 6 18M6 6l12 12" />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '18px 20px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Expense title</div><input value={claimTitle} onChange={e => setClaimTitle(e.target.value)} placeholder="e.g. Mic batteries" style={{ width: '100%', border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '12px 14px', fontSize: 14, fontWeight: 500, color: t.text, outline: 'none' }} /></div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Amount</div><div style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '0 14px' }}><span style={{ fontSize: 15, fontWeight: 700, color: t.text2 }}>₹</span><input value={claimAmount} onChange={e => setClaimAmount(e.target.value)} inputMode="numeric" placeholder="0" style={{ width: '100%', border: 'none', background: 'transparent', padding: '12px 0', fontSize: 14, fontWeight: 600, color: t.text, outline: 'none' }} /></div></div>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Date</div><div style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '12px 14px' }}><Ic size={15} color={t.text3} d="M3 4h18v18H3zM16 2v4M8 2v4M3 10h18" /><span style={{ fontSize: 13.5, color: t.text, fontWeight: 500 }}>16 Jun</span></div></div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Category</div>
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
                      {['Equipment','Logistics','Consumables','Food','Travel'].map(c => { const on = formCat === c; return <button key={c} onClick={() => setFormCat(c)} style={{ flexShrink: 0, border: `1px solid ${on ? t.accent : t.border}`, background: on ? t.accent : t.surface2, color: on ? '#fff' : t.text2, borderRadius: 10, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{c}</button> })}
                    </div>
                  </div>
                  <div><div style={{ fontSize: 12.5, fontWeight: 700, color: t.text2, marginBottom: 7 }}>Description</div><textarea rows={2} placeholder="What was this for?" style={{ width: '100%', border: `1px solid ${t.border}`, background: t.surface2, borderRadius: 11, padding: '12px 14px', fontSize: 14, fontWeight: 500, color: t.text, outline: 'none', resize: 'none' }} /></div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['Upload Invoice','Upload Proof'].map((label, i) => (
                      <button key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, border: `1px dashed ${t.border2}`, background: t.surface2, borderRadius: 13, padding: '18px 10px', color: t.text2, cursor: 'pointer' }}>
                        <Ic size={22} color={t.text2} d={i === 0 ? 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12' : 'M3 3h18v18H3zM9 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0m12 6-5-5L5 21'} />
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{label}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ background: t.surface2, borderRadius: 12, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Ic size={17} color={t.text3} d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 16v-4M12 8h.01" />
                    <span style={{ fontSize: 11.5, color: t.text2, fontWeight: 500, lineHeight: 1.4 }}>Routes to HOD → Finance team for approval.</span>
                  </div>
                  <button onClick={() => { actions.submitClaim({ title: claimTitle || 'Reimbursement', amount: Number(claimAmount) || 0, category: formCat, date_label: '16 Jun' }); setClaimTitle(''); setClaimAmount(''); setModal(null); showToast('Reimbursement submitted for approval') }} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: 13, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Submit Request</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══ TOAST ═══ */}
        {toast && (
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 160, zIndex: 40, background: t.text, color: t.surface, fontSize: 13, fontWeight: 600, padding: '11px 18px', borderRadius: 11, boxShadow: t.shadowLg, animation: 'obFade .2s ease', whiteSpace: 'nowrap', maxWidth: '90%' }}>{toast}</div>
        )}

        {/* ═══ FAB + BOTTOM NAV ═══ */}
        {showChrome && (
          <>
            <button onClick={() => setFabOpen(o => !o)} style={{ position: 'absolute', right: 18, bottom: 84, zIndex: 30, width: 56, height: 56, borderRadius: 18, border: 'none', background: t.accent, boxShadow: '0 6px 20px rgba(79,70,229,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform .2s ease', transform: fabOpen ? 'rotate(45deg)' : 'none' }}>
              <Ic size={24} color="#fff" sw={2.4} d="M12 5v14M5 12h14" />
            </button>
            <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, background: t.surface, borderTop: `1px solid ${t.border}`, display: 'flex', padding: '9px 8px 22px' }}>
              {[
                { key: 'home', label: 'Home', d1: 'M3 10.5 12 3l9 7.5', d2: 'M5 9.5V20h14V9.5' },
                { key: 'tasks', label: 'Tasks', d1: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01' },
                { key: 'finance', label: 'Finance', d1: 'M12 2v20M17 6.5c0-1.7-2-3-5-3s-5 1.3-5 3 2 2.5 5 3 5 1.3 5 3-2 3-5 3-5-1.3-5-3' },
                { key: 'files', label: 'Files', d1: 'M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h7A1.5 1.5 0 0 1 19 10v7.5A1.5 1.5 0 0 1 17.5 19h-13A1.5 1.5 0 0 1 3 17.5z' },
                { key: 'search', label: 'Search', d1: 'M11 4a7 7 0 1 0 0 14A7 7 0 0 0 11 4zM20 20l-3.5-3.5' },
              ].map(nav => {
                const active = tab === nav.key
                return (
                  <button key={nav.key} onClick={() => go(nav.key)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: active ? t.accent : t.text3 }}>
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {(nav.d1 + (nav.d2 ? 'X' + nav.d2 : '')).split('X').map((d, i) => <path key={i} d={d} />)}
                    </svg>
                    <span style={{ fontSize: 10.5, fontWeight: 600 }}>{nav.label}</span>
                  </button>
                )
              })}
            </nav>
          </>
        )}
      </div>
    </div>
  )
}

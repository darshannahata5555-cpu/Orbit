// Demo content. Used as-is when Supabase isn't configured, and as the
// shape reference for the live data layer in src/data/api.js.

export const USER = { name: 'Aarav Mehta', initials: 'AM', role: 'HOD', dept: 'Technicals' }

export const ANNOUNCEMENTS = [
  { tag: 'Urgent', title: 'Main stage rehearsal moved to 6 PM', body: 'All Technicals & Proshows POCs report to Audi 1. Bring updated cue sheets.', meta: 'Pinned · Global' },
  { tag: 'Dept', title: 'Sound check slots now open', body: 'Book a 30-min slot for your Day 2 acts via the Technicals channel.', meta: 'Technicals · 2h ago' },
  { tag: 'Info', title: 'ID badges ready for pickup', body: 'Collect crew badges from the Ops desk, Block C.', meta: 'Ops & Logistics · 5h ago' },
]

// Static UI config — not stored in the DB.
export const COMM_HUB = [
  { label: 'Messages', icon: 'M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z', badge: '4', kind: 'blue' },
  { label: 'Dept Chat', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', badge: null, kind: 'accent' },
  { label: 'Groups', icon: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', badge: '3', kind: 'green' },
]

export const HOME_TASKS = [
  { id: 't1', title: 'Finalize LED wall vendor quotes', pr: 'High', due: 'Today, 5 PM', poc: 'RK', prog: 70 },
  { id: 't2', title: 'Stage lighting plot — Day 1', pr: 'Medium', due: 'Tomorrow', poc: 'SD', prog: 30 },
]

export const EVENTS = [
  { time: '10:00', title: 'Council sync', dept: 'Council · Audi 2', kind: 'accent' },
  { time: '14:00', title: 'Vendor walkthrough', dept: 'Technicals · Main Ground', kind: 'blue' },
  { time: '18:00', title: 'Main stage rehearsal', dept: 'Proshows · Audi 1', kind: 'amber' },
]

export const ALL_TASKS = [
  { id: 't1', title: 'Finalize LED wall vendor quotes', status: 'In Progress', pr: 'High', due: 'Today, 5 PM', poc: 'RK', dept: 'Technicals', prog: 70, me: true, cross: false, overdue: false, dep: null },
  { id: 't2', title: 'Stage lighting plot — Day 1', status: 'Pending', pr: 'Medium', due: 'Tomorrow', poc: 'SD', dept: 'Technicals', prog: 30, me: true, cross: false, overdue: false, dep: null },
  { id: 't3', title: 'Cue sheet sign-off', status: 'Waiting for Dependency', pr: 'High', due: '18 Jun', poc: 'AM', dept: 'Technicals', prog: 10, me: true, cross: true, overdue: false, dep: 'Creatives PR & M' },
  { id: 't4', title: 'Mic inventory & spares check', status: 'Blocked', pr: 'Medium', due: '17 Jun', poc: 'PT', dept: 'Technicals', prog: 0, me: false, cross: false, overdue: true, dep: null },
  { id: 't5', title: 'Sponsor branding on LED loop', status: 'Pending', pr: 'High', due: '19 Jun', poc: 'JN', dept: 'Sponsorship', prog: 0, me: false, cross: true, overdue: false, dep: 'Technicals' },
  { id: 't6', title: 'Rehearsal schedule lock', status: 'Pending', pr: 'High', due: '15 Jun', poc: 'AM', dept: 'Technicals', prog: 20, me: true, cross: false, overdue: true, dep: null },
  { id: 't7', title: 'Backstage power audit', status: 'Completed', pr: 'Low', due: '14 Jun', poc: 'RK', dept: 'Technicals', prog: 100, me: false, cross: false, overdue: false, dep: null },
  { id: 't8', title: 'Speaker placement plan', status: 'Verified', pr: 'Medium', due: '12 Jun', poc: 'SD', dept: 'Technicals', prog: 100, me: false, cross: false, overdue: false, dep: null },
]

export const FINANCE = { allocated: 250000, spent: 168500, remaining: 81500, pending: 32400 }

export const FINANCE_REQUESTS = [
  { id: 'r1', who: 'Priya Tandon', initials: 'PT', title: 'Wireless mic batteries (×24)', amount: 8400, category: 'Equipment', date: '14 Jun', invoice: 'INV-2291' },
  { id: 'r2', who: 'Rohan Kapoor', initials: 'RK', title: 'LED wall transport — vendor', amount: 15000, category: 'Logistics', date: '13 Jun', invoice: 'INV-2287' },
  { id: 'r3', who: 'Sana Dewan', initials: 'SD', title: 'Gel sheets & gaffer tape', amount: 3200, category: 'Consumables', date: '12 Jun', invoice: 'INV-2280' },
]

export const MY_CLAIMS = [
  { id: 'm1', title: 'Stage crew refreshments', amount: 2100, status: 'Reimbursed', date: '10 Jun' },
  { id: 'm2', title: 'Cable adapters & connectors', amount: 5800, status: 'Approved', date: '11 Jun' },
  { id: 'm3', title: 'Backup SD cards', amount: 1900, status: 'Pending', date: '15 Jun' },
]

export const FOLDERS = [
  { name: 'Department Files', count: 42, kind: 'accent' },
  { name: 'Event Files', count: 28, kind: 'blue' },
  { name: 'Finance Documents', count: 16, kind: 'green' },
  { name: 'Sponsors', count: 11, kind: 'amber' },
  { name: 'Creative Assets', count: 67, kind: 'red' },
]

export const RECENT_FILES = [
  { name: 'LED Wall Layout v3.pdf', type: 'PDF', size: '2.4 MB', date: 'Today', starred: true },
  { name: 'Day 1 Run Sheet.xlsx', type: 'XLS', size: '88 KB', date: 'Today', starred: false },
  { name: 'Stage Render Final.png', type: 'IMG', size: '5.1 MB', date: 'Yesterday', starred: true },
  { name: 'Sound Vendor Contract.pdf', type: 'PDF', size: '640 KB', date: '14 Jun', starred: false },
  { name: 'Crew Roster.docx', type: 'DOC', size: '120 KB', date: '13 Jun', starred: false },
]

export const CONVERSATIONS = [
  { id: 'c1', name: 'Sana Dewan', sub: 'typing…', time: 'now', unread: 0, av: 'SD', online: true, typing: true, kind: 'DM' },
  { id: 'c2', name: 'Technicals Channel', sub: 'Priya: mics sorted, spares logged', time: '2m', unread: 3, channel: true, kind: 'Channel' },
  { id: 'c3', name: 'Rohan Kapoor', sub: '🎙 Voice message · 0:14', time: '18m', unread: 1, av: 'RK', kind: 'DM' },
  { id: 'c4', name: 'Stage Crew', sub: 'You: cue sheet shared', time: '1h', unread: 0, group: true, kind: 'Group' },
  { id: 'c5', name: 'Proshows Channel', sub: 'Rehearsal moved to 6 PM today', time: '3h', unread: 0, channel: true, kind: 'Channel' },
]

export const BASE_THREAD = [
  { me: false, text: 'Hey, did the LED vendor confirm the install slot?', time: '5:42' },
  { me: true, text: 'Yes — locked for 2 PM tomorrow. Sending the layout now.', time: '5:43', read: true },
  { me: true, kind: 'file', fname: 'LED Wall Layout v3.pdf', fsize: '2.4 MB', time: '5:43', read: true },
  { me: false, text: 'Perfect, that works 🙌', time: '5:44', reaction: '👍' },
  { me: false, kind: 'voice', dur: '0:14', time: '5:45' },
  { me: true, text: 'Can you confirm the rigging crew is briefed?', time: '5:46', read: false },
]

export const SEARCH_ITEMS = [
  { type: 'People', name: 'Sana Dewan', sub: 'Core Member · Technicals', av: 'SD' },
  { type: 'People', name: 'Rohan Kapoor', sub: 'Member · Technicals', av: 'RK' },
  { type: 'People', name: 'Priya Tandon', sub: 'Member · Technicals', av: 'PT' },
  { type: 'Tasks', name: 'Finalize LED wall vendor quotes', sub: 'In Progress · High · Today', av: null },
  { type: 'Tasks', name: 'Cue sheet sign-off', sub: 'Waiting for Dependency · 18 Jun', av: null },
  { type: 'Files', name: 'LED Wall Layout v3.pdf', sub: '2.4 MB · PDF · Today', av: null },
  { type: 'Files', name: 'Sound Vendor Contract.pdf', sub: '640 KB · PDF · 14 Jun', av: null },
  { type: 'Messages', name: 'Can you approve the mic battery claim?', sub: 'Priya Tandon · Technicals', av: null },
  { type: 'Announcements', name: 'Main stage rehearsal moved to 6 PM', sub: 'Pinned · Global', av: null },
]

export const FAB_ACTIONS = [
  { label: 'New Task', icon: 'M9 11l3 3 8-8M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', kind: 'newtask' },
  { label: 'New Chat', icon: 'M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.5 8.5 0 0 1 21 11.5z', kind: 'chat' },
  { label: 'Upload File', icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12', kind: 'upload' },
  { label: 'Announcement', icon: 'M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6', kind: 'announce' },
]

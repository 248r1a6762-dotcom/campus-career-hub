import React, { useState, useEffect } from 'react';
import { Users, Plus, Video, MapPin, Clock, Calendar, BookOpen, CheckCircle } from 'lucide-react';

export default function GroupStudies({ user, apiBase }) {
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', topic: '', date: '', time: '', maxMembers: 8, description: '', mode: 'Online' });
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = () => {
    fetch(`${apiBase}/campus/study-groups`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).then(setGroups).catch(console.error);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    fetch(`${apiBase}/campus/study-groups/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, maxMembers: parseInt(form.maxMembers) })
    }).then(async r => {
      const data = await r.json();
      if (r.ok) {
        setMsg('Study group created!');
        setShowForm(false);
        setForm({ subject: '', topic: '', date: '', time: '', maxMembers: 8, description: '', mode: 'Online' });
        fetchGroups();
        setTimeout(() => setMsg(''), 3000);
      } else setMsg(data.message);
    }).catch(console.error);
  };

  const handleJoin = (groupId) => {
    fetch(`${apiBase}/campus/study-groups/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ groupId })
    }).then(async r => {
      const data = await r.json();
      setMsg(data.message);
      if (r.ok) fetchGroups();
      setTimeout(() => setMsg(''), 3000);
    }).catch(console.error);
  };

  const isMember = (group) => group.members?.includes(user?.id);
  const isFull = (group) => (group.members?.length || 0) >= group.maxMembers;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            🧑‍🤝‍🧑 Group Studies
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Create or join collaborative peer study sessions — online or on-campus.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Create Session
        </button>
      </div>

      {msg && <div style={{ background: msg.includes('created') || msg.includes('Joined') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: msg.includes('created') || msg.includes('Joined') ? 'var(--success)' : 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid', fontWeight: 600 }}>{msg}</div>}

      {/* Create Form */}
      {showForm && (
        <div className="card" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>📝 Create a Study Session</h3>
          <form onSubmit={handleCreate}>
            <div className="grid-cols-2" style={{ gap: '14px', marginBottom: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subject</label>
                <input className="form-control" placeholder="e.g. Data Structures & Algorithms" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Session Topic</label>
                <input className="form-control" placeholder="e.g. Graph Traversal — BFS & DFS" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Time</label>
                <input type="time" className="form-control" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mode</label>
                <select className="form-control" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
                  <option value="Online">Online (Jitsi Meet)</option>
                  <option value="Offline">On-Campus</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Max Members</label>
                <input type="number" className="form-control" min="2" max="50" value={form.maxMembers} onChange={e => setForm({ ...form, maxMembers: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                <label className="form-label">Description (Optional)</label>
                <textarea className="form-control" rows="2" placeholder="Describe what topics you'll cover..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Study Group</button>
            </div>
          </form>
        </div>
      )}

      {/* Active Sessions Stats */}
      <div className="grid-cols-3">
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{groups.length}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Sessions</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>
            {groups.filter(g => g.mode === 'Online').length}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Online Sessions</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)' }}>
            {groups.filter(g => (g.members || []).includes(user?.id)).length}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>My Sessions</p>
        </div>
      </div>

      {/* Groups List */}
      <div className="grid-cols-2">
        {groups.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>No study groups yet. Create the first one!</p>
          </div>
        ) : groups.map(group => {
          const joined = isMember(group);
          const full = isFull(group);
          return (
            <div key={group._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: joined ? '1px solid rgba(99,102,241,0.3)' : '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>{group.subject}</span>
                  <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: '6px' }}>{group.topic}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>by {group.creatorName}</p>
                </div>
                <span className={`badge ${group.mode === 'Online' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.6rem' }}>
                  {group.mode}
                </span>
              </div>

              {group.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{group.description}</p>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14} color="var(--primary)" /> {group.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Clock size={14} color="var(--secondary)" /> {group.time}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <Users size={14} color="var(--info)" /> {group.members?.length || 0}/{group.maxMembers} members
                </div>
              </div>

              {/* Member names */}
              {group.memberNames?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {group.memberNames.slice(0, 4).map((name, i) => (
                    <span key={i} style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600 }}>{name}</span>
                  ))}
                  {group.memberNames.length > 4 && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>+{group.memberNames.length - 4} more</span>}
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                {group.meetLink && (
                  <a href={group.meetLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px' }}>
                    <Video size={14} /> Join Meet
                  </a>
                )}
                {!joined && !full ? (
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px' }} onClick={() => handleJoin(group._id)}>
                    <Plus size={14} /> Join Group
                  </button>
                ) : joined ? (
                  <button className="btn btn-secondary" disabled style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px', color: 'var(--success)' }}>
                    <CheckCircle size={14} /> Joined
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px', opacity: 0.6 }}>Group Full</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

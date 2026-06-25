import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, CheckCircle, Video } from 'lucide-react';

export default function VirtualEvents({ user, apiBase }) {
  const [events, setEvents] = useState([]);
  const [regMsg, setRegMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch(`${apiBase}/events`)
      .then(r => r.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  };

  const handleRegister = (eventId) => {
    if (!token) return;

    fetch(`${apiBase}/events/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ eventId })
    })
      .then(async r => {
        const resData = await r.json();
        if (r.ok) {
          setRegMsg('Registered successfully! Link sent to your campus email.');
          fetchEvents();
          setTimeout(() => setRegMsg(''), 3000);
        } else {
          setRegMsg(resData.message || 'Error registering for event.');
        }
      })
      .catch(err => {
        console.error(err);
        setRegMsg('Error registering.');
      });
  };

  const isRegistered = (event) => {
    if (!user) return false;
    return event.attendees?.includes(user.id || user._id);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Virtual Career Fairs & Networking
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Register for virtual events, meet recruiter panels, and explore company webinars.
        </p>
      </div>

      {regMsg && (
        <div style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 600 }}>
          {regMsg}
        </div>
      )}

      {/* Events Cards Grid */}
      <div className="grid-cols-2">
        {events.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p>No upcoming events listed at this time.</p>
          </div>
        ) : (
          events.map((ev) => {
            const joined = isRegistered(ev);
            return (
              <div key={ev._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{ev.category}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '8px' }}>{ev.title}</h3>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{ev.description}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={16} color="var(--primary)" />
                    <span><b>Date:</b> {ev.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Video size={16} color="var(--secondary)" />
                    <span><b>Time:</b> {ev.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Users size={16} color="var(--info)" />
                    <span><b>Registered:</b> {ev.attendees?.length || 0} students joined</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hosted by {ev.company}</span>
                  
                  {user?.role === 'student' && (
                    joined ? (
                      <button className="btn btn-secondary" disabled style={{ opacity: 0.7, color: 'var(--success)' }}>
                        <CheckCircle size={14} /> Registered
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={() => handleRegister(ev._id)}>
                        Register Event
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

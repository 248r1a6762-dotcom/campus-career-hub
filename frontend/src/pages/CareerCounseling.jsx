import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function CareerCounseling({ user, apiBase }) {
  const [sessions, setSessions] = useState([]);
  
  // Booking Form State
  const [advisorName, setAdvisorName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookMsg, setBookMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchSessions();
    }
  }, [token]);

  const fetchSessions = () => {
    fetch(`${apiBase}/counseling/sessions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setSessions(data))
      .catch(err => console.error(err));
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!advisorName || !date || !time) return;

    fetch(`${apiBase}/counseling/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        advisorName,
        date,
        time,
        notes
      })
    })
      .then(async r => {
        const resData = await r.json();
        if (r.ok) {
          setBookMsg('Advising appointment booked successfully!');
          fetchSessions();
          setTimeout(() => {
            setAdvisorName('');
            setDate('');
            setTime('');
            setNotes('');
            setBookMsg('');
          }, 2000);
        } else {
          setBookMsg(resData.message || 'Error booking appointment.');
        }
      })
      .catch(err => {
        console.error(err);
        setBookMsg('Error booking session.');
      });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Career Services Counseling
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Schedule 1-on-1 counseling sessions with professional university advisors for mock interviews and resume reviews.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 2.2fr', gap: '32px' }}>
        
        {/* Left: Booking Form */}
        {user?.role === 'student' && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Book an Advising Appointment
            </h3>

            <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="form-group">
                <label className="form-label">Choose Advisor / Coach</label>
                <select className="form-control" value={advisorName} onChange={(e) => setAdvisorName(e.target.value)} required>
                  <option value="">Select Coach...</option>
                  <option value="Dr. Sarah Jenkins (Tech & CS Career Lead)">Dr. Sarah Jenkins (Tech & CS Career Lead)</option>
                  <option value="Marcus Vance (Finance & Business Advisor)">Marcus Vance (Finance & Business Advisor)</option>
                  <option value="Elena Rostova (Design & Portfolio Reviewer)">Elena Rostova (Design & Portfolio Reviewer)</option>
                  <option value="Jonathan Cross (Behavioral & HR Expert)">Jonathan Cross (Behavioral & HR Expert)</option>
                </select>
              </div>

              <div className="grid-cols-2" style={{ gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Date</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Preferred Time Slot</label>
                  <select className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required>
                    <option value="">Select Time...</option>
                    <option value="09:00 AM - 09:45 AM">09:00 AM - 09:45 AM</option>
                    <option value="11:00 AM - 11:45 AM">11:00 AM - 11:45 AM</option>
                    <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM</option>
                    <option value="04:00 PM - 04:45 PM">04:00 PM - 04:45 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">What would you like to focus on?</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="e.g. Mock coding technical interview review, resume formatting review..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {bookMsg && <span style={{ fontSize: '0.9rem', color: bookMsg.includes('success') ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{bookMsg}</span>}

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Book Counseling Appointment
              </button>
            </form>
          </div>
        )}

        {/* Right: Booked Advising Appointments List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Scheduled Advising Sessions ({sessions.length})
          </h3>

          {sessions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '24px 0' }}>
              No advising appointments scheduled.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sessions.map((sess) => (
                <div key={sess._id} style={{ border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Session with: {sess.advisorName}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} color="var(--primary)" /> {sess.date}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} color="var(--secondary)" /> {sess.time}
                      </p>
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{sess.status}</span>
                  </div>

                  {sess.notes && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderLeft: '3px solid var(--primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <b>Notes:</b> {sess.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Users, Search, Award, MessageSquare, Video, CheckCircle2, UserCheck, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AlumniMentorship({ user, apiBase }) {
  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  
  // Mentor Match Results
  const [matchResults, setMatchResults] = useState([]);
  const [matchingMode, setMatchingMode] = useState(false);
  const [targetIndustry, setTargetIndustry] = useState('');

  // Session Scheduling Form Modal
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [scheduleMsg, setScheduleMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMentors();
    if (token) {
      fetchSessions();
    }
  }, [token]);

  const fetchMentors = () => {
    fetch(`${apiBase}/mentors`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setMentors(data))
      .catch(err => console.error(err));
  };

  const fetchSessions = () => {
    fetch(`${apiBase}/mentors/sessions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setSessions(data))
      .catch(err => console.error(err));
  };

  const handleRunMatch = (e) => {
    e.preventDefault();
    if (!targetIndustry) return;

    fetch(`${apiBase}/mentors/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ targetIndustry })
    })
      .then(r => r.json())
      .then(data => {
        setMatchResults(data);
        setMatchingMode(true);
        confetti({ particleCount: 50, spread: 60 });
      })
      .catch(err => console.error(err));
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMentor) return;

    fetch(`${apiBase}/mentors/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        mentorId: selectedMentor.id,
        date,
        time,
        topic,
        notes
      })
    })
      .then(async r => {
        const resData = await r.json();
        if (r.ok) {
          setScheduleMsg('Mentorship meeting scheduled successfully!');
          fetchSessions();
          setTimeout(() => {
            setSelectedMentor(null);
            setDate('');
            setTime('');
            setTopic('');
            setNotes('');
            setScheduleMsg('');
          }, 2000);
        } else {
          setScheduleMsg(resData.message || 'Error scheduling meeting.');
        }
      })
      .catch(err => {
        console.error(err);
        setScheduleMsg('Error scheduling meeting.');
      });
  };

  // Filter mentor directories based on query
  const filteredMentors = mentors.filter(mentor => {
    const query = search.toLowerCase();
    const matchesQuery = 
      mentor.name.toLowerCase().includes(query) ||
      mentor.company.toLowerCase().includes(query) ||
      mentor.title.toLowerCase().includes(query) ||
      mentor.bio.toLowerCase().includes(query) ||
      mentor.skills.some(s => s.toLowerCase().includes(query));

    const matchesIndustry = industry ? mentor.industry === industry : true;
    return matchesQuery && matchesIndustry;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Alumni & Mentor Connections
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Network with alumni, access mentor matching resources, and hop on virtual call meetings.
        </p>
      </div>

      {user?.role === 'student' && (
        /* Top Section: Smart Mentor Matchmaker */
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={18} color="var(--primary)" /> Smart Matchmaker Quiz
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-12px' }}>
            Select your career industry of interest, and we will find mentors with highest overlapping expertise.
          </p>

          <form onSubmit={handleRunMatch} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
              <label className="form-label">Select Target Industry</label>
              <select className="form-control" value={targetIndustry} onChange={(e) => setTargetIndustry(e.target.value)} required>
                <option value="">Choose Industry...</option>
                <option value="engineering">Software Engineering & Tech</option>
                <option value="finance">Finance & Investment Banking</option>
                <option value="design">UI/UX & Product Design</option>
                <option value="marketing">Digital Marketing & Brand Strategy</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '45px', padding: '0 24px' }}>
              Find Best Matches
            </button>
          </form>

          {matchingMode && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700 }}>Matches Found ({matchResults.length})</h4>
                <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => setMatchingMode(false)}>Close Matches</button>
              </div>

              <div className="grid-cols-3">
                {matchResults.map((res, i) => (
                  <div key={res.mentor.id} style={{ border: '1px solid var(--primary)', background: 'rgba(99,102,241,0.02)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontWeight: 700 }}>{res.mentor.name}</h4>
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Match Score: {res.matchScore}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {res.mentor.title} at {res.mentor.company}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineBreak: 'anywhere' }}>
                      {res.mentor.bio}
                    </p>
                    <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem', width: '100%', marginTop: 'auto' }} onClick={() => setSelectedMentor(res.mentor)}>
                      Schedule Call
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Scheduled Sessions & Mentor Directory */}
      <div style={{ display: 'grid', gridTemplateColumns: user?.role === 'student' ? '1.5fr 2.5fr' : '1fr', gap: '32px' }}>
        
        {/* Left column: Scheduled sessions (student only) */}
        {user?.role === 'student' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                Mentorship Meetings ({sessions.length})
              </h3>

              {sessions.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>
                  No sessions scheduled yet. Check the directory or use the Matchmaker to book a call!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sessions.map((sess) => (
                    <div key={sess._id} style={{ border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{sess.topic}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Mentor: {sess.mentorName} ({sess.mentorTitle} at {sess.mentorCompany})
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Time: {sess.date} at {sess.time}
                        </p>
                      </div>

                      {sess.notes && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderLeft: '3px solid var(--primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {sess.notes}
                        </div>
                      )}

                      <a href={sess.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem', gap: '6px' }}>
                        <Video size={14} /> Join Video Call
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right column: Browse All Mentors Directory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search Header Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Alumni Mentor Directory</h3>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search mentors by name, company, skill (e.g. React)..." 
                  className="form-control" 
                  style={{ width: '100%', paddingLeft: '44px' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select className="form-control" style={{ width: '180px' }} value={industry} onChange={(e) => setIndustry(e.target.value)}>
                <option value="">All Industries</option>
                <option value="engineering">Software Engineering</option>
                <option value="finance">Finance & Banking</option>
                <option value="design">UI/UX Design</option>
                <option value="marketing">Digital Marketing</option>
              </select>
            </div>
          </div>

          {/* Mentors list grid */}
          <div className="grid-cols-2">
            {filteredMentors.length === 0 ? (
              <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <p>No mentors found matching your queries.</p>
              </div>
            ) : (
              filteredMentors.map((mentor) => (
                <div key={mentor.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{mentor.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>
                      {mentor.title} at <span style={{ color: 'var(--primary)' }}>{mentor.company}</span>
                    </p>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Class of {mentor.graduationYear}</span>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flexGrow: 1 }}>{mentor.bio}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {mentor.skills.map((skill, idx) => (
                      <span key={idx} className="badge badge-info" style={{ fontSize: '0.65rem' }}>{skill}</span>
                    ))}
                  </div>

                  {user?.role === 'student' && (
                    <button className="btn btn-primary" style={{ marginTop: '8px', width: '100%', gap: '6px' }} onClick={() => setSelectedMentor(mentor)}>
                      <Calendar size={16} /> Schedule Call
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Booking schedule form modal */}
      {selectedMentor && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Schedule Session</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>With {selectedMentor.name} ({selectedMentor.title} at {selectedMentor.company})</p>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid-cols-2" style={{ gap: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Time</label>
                  <input type="time" className="form-control" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Discussion Topic</label>
                <select className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} required>
                  <option value="">Select Topic...</option>
                  <option value="Resume & CV Review">Resume & CV Review</option>
                  <option value="Mock Technical Coding Interview">Mock Technical Coding Interview</option>
                  <option value="Wall Street Networking Tips">Wall Street Networking Tips</option>
                  <option value="General Career Guidance">General Career Guidance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pre-meeting Notes or Questions</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Share details or files you want the mentor to review..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {scheduleMsg && <span style={{ fontSize: '0.9rem', color: scheduleMsg.includes('success') ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{scheduleMsg}</span>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedMentor(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Book Appointment</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Award, Briefcase, ChevronRight, User, TrendingUp } from 'lucide-react';

export default function Dashboard({ user, setTab, apiBase }) {
  const [stats, setStats] = useState({
    assessmentDone: false,
    badges: [],
    applicationsCount: 0,
    meetingsCount: 0,
    careerPlanCount: 0
  });

  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    
    // Fetch applications
    fetch(`${apiBase}/jobs/student-applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      setStats(prev => ({ ...prev, applicationsCount: data.length }));
    })
    .catch(err => console.error(err));

    // Fetch sessions
    fetch(`${apiBase}/mentors/sessions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.ok ? r.json() : [])
    .then(data => {
      setUpcomingMeetings(data.slice(0, 3));
      setStats(prev => ({ ...prev, meetingsCount: data.length }));
    })
    .catch(err => console.error(err));
  }, [token, apiBase]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Here is an overview of your career preparation activities.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-secondary)', padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <User size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Role: {user?.role === 'alumni' ? 'Mentor' : user?.role === 'employer' ? 'Recruiter' : 'Student'}</span>
        </div>
      </div>

      {/* Overview Metric Stats Cards Grid */}
      <div className="grid-cols-4">
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Assessments</span>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <TrendingUp size={20} color="var(--primary)" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              {user?.profile?.assessmentCompleted ? 'Completed' : 'Pending'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px' }} onClick={() => setTab('exploration')}>
              {user?.profile?.assessmentCompleted ? 'View career suggestions' : 'Take assessment now'} <ChevronRight size={14} />
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Badges & Skills</span>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Award size={20} color="var(--secondary)" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              {user?.profile?.badges?.length || 0} Earned
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px' }} onClick={() => setTab('skills')}>
              View course library <ChevronRight size={14} />
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Jobs Applied</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Briefcase size={20} color="var(--success)" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              {stats.applicationsCount} Applications
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px' }} onClick={() => setTab('jobs')}>
              Explore open listings <ChevronRight size={14} />
            </p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Mentor Sessions</span>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
              <Calendar size={20} color="var(--info)" />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
              {stats.meetingsCount} Scheduled
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px', display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '4px' }} onClick={() => setTab('mentors')}>
              Connect with alumni <ChevronRight size={14} />
            </p>
          </div>
        </div>

      </div>

      {/* Main Section Grid: Upcoming Meetings & Skill Tracking */}
      <div className="grid-cols-2">
        
        {/* Left Side: Upcoming Mentorship Meetings */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="var(--primary)" /> Upcoming Mentorship
            </h3>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setTab('mentors')}>
              Find Mentor
            </button>
          </div>

          {upcomingMeetings.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No upcoming meetings scheduled.</p>
              <button className="btn btn-primary" style={{ marginTop: '12px', padding: '8px 16px' }} onClick={() => setTab('mentors')}>
                Match with a Mentor
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingMeetings.map((meeting) => (
                <div key={meeting._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>{meeting.topic}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      With {meeting.mentorName} ({meeting.mentorTitle} at {meeting.mentorCompany})
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Date: {meeting.date} at {meeting.time}
                    </p>
                  </div>
                  <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                    Join
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Digital Badges & Accomplishments */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="var(--secondary)" /> My Credentials
            </h3>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setTab('skills')}>
              View Courses
            </button>
          </div>

          {!user?.profile?.badges || user.profile.badges.length === 0 ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No credentials earned yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Complete course quizzes to earn verified digital badges.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {user.profile.badges.map((badge, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', background: 'rgba(236,72,153,0.05)', border: '1px solid rgba(236,72,153,0.2)', padding: '16px 20px', borderRadius: 'var(--radius-md)', minWidth: '120px', textAlign: 'center' }}>
                  <Award size={36} color="var(--secondary)" style={{ filter: 'drop-shadow(0 0 8px rgba(236,72,153,0.4))' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{badge}</span>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Verified</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

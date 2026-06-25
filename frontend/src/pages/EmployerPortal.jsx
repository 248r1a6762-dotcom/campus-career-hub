import React, { useState, useEffect } from 'react';
import { PlusCircle, FileText, Check, X, Clipboard, Briefcase, Mail } from 'lucide-react';

export default function EmployerPortal({ user, apiBase }) {
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'post-job'
  
  // Job Post Form
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState(user?.profile?.companyName || '');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('Internship');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [industry, setIndustry] = useState('engineering');
  const [postMsg, setPostMsg] = useState('');

  // Applicant Focus View
  const [focusApp, setFocusApp] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && user?.role === 'employer') {
      fetchApplications();
    }
  }, [token, user]);

  const fetchApplications = () => {
    fetch(`${apiBase}/jobs/employer-applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err));
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    setPostMsg('Posting position...');

    fetch(`${apiBase}/jobs/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: jobTitle,
        company: companyName,
        location,
        salary,
        type: jobType,
        description,
        requirements,
        industry
      })
    })
      .then(async r => {
        const resData = await r.json();
        if (r.ok) {
          setPostMsg('Job posting created successfully!');
          setTimeout(() => {
            setJobTitle('');
            setLocation('');
            setSalary('');
            setDescription('');
            setRequirements('');
            setPostMsg('');
            setActiveTab('applications');
          }, 2000);
        } else {
          setPostMsg(resData.message || 'Error posting job.');
        }
      })
      .catch(err => {
        console.error(err);
        setPostMsg('Error posting job.');
      });
  };

  const handleStatusChange = (appId, newStatus) => {
    fetch(`${apiBase}/jobs/application-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        applicationId: appId,
        status: newStatus
      })
    })
      .then(r => {
        if (r.ok) {
          fetchApplications();
          if (focusApp && focusApp._id === appId) {
            setFocusApp(prev => ({ ...prev, status: newStatus }));
          }
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Employer Recruitment Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Post positions, review resumes, and manage candidates applying to your listings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('applications'); setFocusApp(null); }}
          >
            Review Candidates
          </button>
          <button 
            className={`btn ${activeTab === 'post-job' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('post-job')}
          >
            <PlusCircle size={16} /> Post a Job
          </button>
        </div>
      </div>

      {activeTab === 'post-job' ? (
        /* Post a Job Form Panel */
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Post a New Internship / Job</h2>
          
          <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="grid-cols-2" style={{ gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Position Title</label>
                <input type="text" className="form-control" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer Intern" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Company Name</label>
                <input type="text" className="form-control" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Google" required />
              </div>
            </div>

            <div className="grid-cols-3" style={{ gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location</label>
                <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mountain View, CA or Remote" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Salary Range</label>
                <input type="text" className="form-control" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. $45/hr or $110,000/yr" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Job Category / Industry</label>
                <select className="form-control" value={industry} onChange={(e) => setIndustry(e.target.value)} required>
                  <option value="engineering">Software Tech</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="design">UI/UX Design</option>
                  <option value="marketing">Digital Marketing</option>
                </select>
              </div>
            </div>

            <div className="grid-cols-2" style={{ gap: '16px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Job Type</label>
                <select className="form-control" value={jobType} onChange={(e) => setJobType(e.target.value)} required>
                  <option value="Internship">Internship</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Job Description</label>
              <textarea className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Outline the projects, team roles, and daily activities..." required />
            </div>

            <div className="form-group">
              <label className="form-label">Requirements (Skills & Education)</label>
              <textarea className="form-control" rows="3" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="e.g. Currently pursuing a CS major. Familarity with React or Python..." required />
            </div>

            {postMsg && <span style={{ fontSize: '0.9rem', color: postMsg.includes('success') ? 'var(--success)' : 'var(--primary)', fontWeight: 700 }}>{postMsg}</span>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('applications')}>Cancel</button>
              <button type="submit" className="btn btn-primary">Publish Job Posting</button>
            </div>
          </form>
        </div>
      ) : (
        /* Candidates Grid & Applications Reviewer */
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr', gap: '32px' }}>
          
          {/* Applications list */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '600px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Received Applications ({applications.length})
            </h3>

            {applications.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '24px 0' }}>
                No applications received for your posted jobs yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.map((app) => {
                  const active = focusApp?._id === app._id;
                  return (
                    <div 
                      key={app._id}
                      onClick={() => setFocusApp(app)}
                      style={{
                        padding: '14px 16px',
                        border: active ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        background: active ? 'rgba(99,102,241,0.04)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.9rem' }}>{app.studentName}</h4>
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
                          {app.status}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Job: {app.jobTitle}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Applicant deep details inspection pane */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '400px' }}>
            {focusApp ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Header Profile Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{focusApp.studentName}</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Mail size={14} /> {focusApp.studentEmail}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Applied Position: <b>{focusApp.jobTitle} ({focusApp.company})</b>
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status Action:</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem' }} onClick={() => handleStatusChange(focusApp._id, 'Interviewing')}>Interview</button>
                      <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--success)' }} onClick={() => handleStatusChange(focusApp._id, 'Accepted')}>Accept</button>
                      <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--danger)' }} onClick={() => handleStatusChange(focusApp._id, 'Rejected')}>Reject</button>
                    </div>
                  </div>
                </div>

                {/* Candidate Cover Letter */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Cover Letter Text</h4>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineBreak: 'anywhere' }}>
                    {focusApp.coverLetterText || <i>No cover letter submitted.</i>}
                  </div>
                </div>

                {/* Candidate Resume Text */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Resume Summary & Skills</h4>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-secondary)', minHeight: '180px', lineBreak: 'anywhere' }}>
                    {focusApp.resumeText || <i>No resume profile setup by candidate.</i>}
                  </div>
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                <Clipboard size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                <p style={{ fontWeight: 600 }}>Select a candidate from the left panel to review details.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

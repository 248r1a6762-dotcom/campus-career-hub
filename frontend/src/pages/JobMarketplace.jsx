import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, FileText, Send, CheckCircle } from 'lucide-react';

export default function JobMarketplace({ user, apiBase }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [type, setType] = useState('');
  
  // Student Resume Profile Info
  const [resumeText, setResumeText] = useState(user?.profile?.resumeUrl || '');
  const [bioText, setBioText] = useState(user?.profile?.bio || '');
  const [profileMsg, setProfileMsg] = useState('');
  
  // Selected Job for Application Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchJobs();
    if (token && user?.role === 'student') {
      fetchApplications();
    }
  }, [search, industry, type, token, user]);

  const fetchJobs = () => {
    let url = `${apiBase}/jobs?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (industry) url += `industry=${encodeURIComponent(industry)}&`;
    if (type) url += `type=${encodeURIComponent(type)}&`;

    fetch(url)
      .then(r => r.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  };

  const fetchApplications = () => {
    fetch(`${apiBase}/jobs/student-applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setApplications(data))
      .catch(err => console.error(err));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setProfileMsg('Updating profile...');
    
    fetch(`${apiBase}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        resumeUrl: resumeText,
        bio: bioText
      })
    })
      .then(r => r.ok ? r.json() : Promise.reject('Failed to update'))
      .then(() => {
        setProfileMsg('Resume and profile details saved successfully!');
        setTimeout(() => setProfileMsg(''), 3000);
      })
      .catch(err => {
        console.error(err);
        setProfileMsg('Error saving profile changes.');
      });
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!token) return;

    fetch(`${apiBase}/jobs/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        jobId: selectedJob._id,
        resumeText: resumeText || 'Attached Profile Resume',
        coverLetterText: coverLetter
      })
    })
      .then(async r => {
        const resData = await r.json();
        if (r.ok) {
          setSubmitMsg('Application submitted successfully!');
          fetchApplications();
          setTimeout(() => {
            setSelectedJob(null);
            setCoverLetter('');
            setSubmitMsg('');
          }, 2000);
        } else {
          setSubmitMsg(resData.message || 'Error submitting application.');
        }
      })
      .catch(err => {
        console.error(err);
        setSubmitMsg('Error submitting application.');
      });
  };

  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied': return <span className="badge badge-info">{status}</span>;
      case 'Reviewed': return <span className="badge badge-warning">{status}</span>;
      case 'Interviewing': return <span className="badge badge-info" style={{ color: 'var(--primary)', background: 'rgba(99,102,241,0.1)' }}>{status}</span>;
      case 'Accepted': return <span className="badge badge-success">{status}</span>;
      case 'Rejected': return <span className="badge badge-danger">{status}</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Internship & Job Marketplace
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Discover upcoming summer internships, university research posts, and full-time jobs.
        </p>
      </div>

      {user?.role === 'student' && (
        /* Student Resume & Profile Editor */
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--primary)" /> Manage Application Assets
          </h3>
          
          <form onSubmit={handleUpdateProfile} className="grid-cols-2" style={{ gap: '20px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Resume / Professional Background (Skills, Experience Summary)</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="Paste your markdown or plain text resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                style={{ resize: 'vertical', minHeight: '100px' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Brief Bio (Headline, Interests)</label>
              <textarea 
                className="form-control" 
                rows="4" 
                placeholder="Tell us about yourself (e.g. CS junior aiming to build full-stack apps)..."
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                style={{ resize: 'vertical', minHeight: '100px' }}
              />
            </div>
            
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success)' }}>{profileMsg}</span>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                Save Profile Assets
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Jobs Section Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: user?.role === 'student' ? '2.5fr 1.5fr' : '1fr', gap: '32px' }}>
        
        {/* Left Side: Job Search and Listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search Filters Row */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
                <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search jobs, companies, or keywords..." 
                  className="form-control" 
                  style={{ width: '100%', paddingLeft: '44px' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-cols-2" style={{ gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <select className="form-control" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  <option value="">All Industries</option>
                  <option value="engineering">Software Engineering & Tech</option>
                  <option value="finance">Finance & Investment Banking</option>
                  <option value="design">UI/UX & Product Design</option>
                  <option value="marketing">Digital Marketing & Brand Strategy</option>
                  <option value="counseling">Career Counseling & coaching</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <select className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">All Job Types</option>
                  <option value="Internship">Internship</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {jobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                <p>No job listings found matching your criteria.</p>
              </div>
            ) : (
              jobs.map((job) => {
                const applied = hasApplied(job._id);
                return (
                  <div key={job._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{job.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
                          {job.company} — <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{job.location}</span>
                        </p>
                      </div>
                      <span className="badge badge-info">{job.type}</span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineBreak: 'anywhere' }}>{job.description}</p>
                    
                    {job.requirements && (
                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Requirements</span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{job.requirements}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--success)', fontWeight: 700 }}>
                        <DollarSign size={16} /> {job.salary || 'Competitive'}
                      </span>
                      
                      {user?.role === 'student' && (
                        applied ? (
                          <button className="btn btn-secondary" disabled style={{ opacity: 0.7, cursor: 'not-allowed', color: 'var(--success)' }}>
                            <CheckCircle size={16} /> Applied
                          </button>
                        ) : (
                          <button className="btn btn-primary" onClick={() => setSelectedJob(job)}>
                            Apply Now
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

        {/* Right Side: Track Applications Status (Student only) */}
        {user?.role === 'student' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                My Applications ({applications.length})
              </h3>

              {applications.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '12px 0' }}>
                  You haven't submitted any job applications yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {applications.map((app) => (
                    <div key={app._id} style={{ border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{app.jobTitle}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.company}</span>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Applied on: {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Application Form Modal overlay */}
      {selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '550px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Apply to {selectedJob.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>{selectedJob.company}</p>
            </div>

            <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Attached Resume Summary</label>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)', maxHeight: '80px', overflowY: 'auto' }}>
                  {resumeText ? resumeText : <i>No resume profile setup! Go fill your background summary above first, or write it directly.</i>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter / Why should we hire you?</label>
                <textarea 
                  className="form-control" 
                  rows="5"
                  placeholder="Explain why you are a good fit for this role..." 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  required
                />
              </div>

              {submitMsg && <span style={{ fontSize: '0.9rem', color: submitMsg.includes('successful') ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{submitMsg}</span>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedJob(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Send size={14} /> Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

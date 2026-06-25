import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, TrendingUp, Briefcase, Users,
  BookOpen, Calendar, HelpCircle, Sun, Moon, LogOut, Lock, Mail, User, Shield,
  BookMarked, UsersRound, Library, Home, CreditCard, BookCopy
} from 'lucide-react';

// Career Pages
import Dashboard from './pages/Dashboard';
import CareerExploration from './pages/CareerExploration';
import JobMarketplace from './pages/JobMarketplace';
import AlumniMentorship from './pages/AlumniMentorship';
import SkillDevelopment from './pages/SkillDevelopment';
import EmployerPortal from './pages/EmployerPortal';
import VirtualEvents from './pages/VirtualEvents';
import CareerCounseling from './pages/CareerCounseling';

// New Campus Pages
import BookExchange from './pages/BookExchange';
import GroupStudies from './pages/GroupStudies';
import LibraryFacilities from './pages/LibraryFacilities';
import HostelFacilities from './pages/HostelFacilities';
import CollegePayment from './pages/CollegePayment';

const API_BASE = '/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [loading, setLoading] = useState(true);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [extraInfo, setExtraInfo] = useState({});
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (token) { fetchUserProfile(); }
    else { setUser(null); setLoading(false); }
  }, [token]);

  const fetchUserProfile = () => {
    setLoading(true);
    fetch(`${API_BASE}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(async r => {
        if (r.ok) { const userData = await r.json(); setUser(userData); }
        else { handleLogout(); }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { name, email, password, role, ...extraInfo };

    fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async r => {
        const data = await r.json();
        if (r.ok) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          setUser(data.user);
          setActiveTab(data.user.role === 'employer' ? 'employer' : 'dashboard');
        } else { setAuthError(data.message || 'Authentication failed.'); }
      })
      .catch(() => setAuthError('Connection error. Please ensure the backend server is running on port 5000.'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(''); setUser(null); setActiveTab('dashboard');
  };

  const updateUserProfile = (updatedUser) => setUser(updatedUser);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem' }}>Campus Career Hub</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-primary)', padding: '20px' }}>
        <div className="card" style={{ width: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎓</div>
            <h1 style={{ fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2rem' }}>
              Campus Career Hub
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
              {isLogin ? 'Sign in to access your campus portal' : 'Create your campus account'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {!isLogin && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" className="form-control" style={{ paddingLeft: '38px' }} placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              </div>
            )}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Campus Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" className="form-control" style={{ paddingLeft: '38px' }} placeholder="name@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="password" className="form-control" style={{ paddingLeft: '38px' }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            {!isLogin && (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Account Role</label>
                  <div style={{ position: 'relative' }}>
                    <Shield size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select className="form-control" style={{ paddingLeft: '38px' }} value={role} onChange={e => setRole(e.target.value)}>
                      <option value="student">Student</option>
                      <option value="alumni">Alumnus (Mentor)</option>
                      <option value="employer">Employer / Recruiter</option>
                    </select>
                  </div>
                </div>

                {role === 'student' && (
                  <div className="grid-cols-2" style={{ gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Major / Branch</label>
                      <input type="text" className="form-control" placeholder="Computer Science" onChange={e => setExtraInfo(p => ({ ...p, major: e.target.value }))} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Graduation Year</label>
                      <input type="number" className="form-control" placeholder="2027" onChange={e => setExtraInfo(p => ({ ...p, graduationYear: e.target.value }))} required />
                    </div>
                  </div>
                )}
                {role === 'alumni' && (
                  <div className="grid-cols-2" style={{ gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Company</label>
                      <input type="text" className="form-control" placeholder="Google" onChange={e => setExtraInfo(p => ({ ...p, company: e.target.value }))} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Job Title</label>
                      <input type="text" className="form-control" placeholder="Software Engineer" onChange={e => setExtraInfo(p => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                      <label className="form-label">Mentor Bio</label>
                      <input type="text" className="form-control" placeholder="How can you help students?" onChange={e => setExtraInfo(p => ({ ...p, mentorBio: e.target.value }))} required />
                    </div>
                  </div>
                )}
                {role === 'employer' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Company Name</label>
                    <input type="text" className="form-control" placeholder="Stripe" onChange={e => setExtraInfo(p => ({ ...p, companyName: e.target.value }))} required />
                  </div>
                )}
              </>
            )}

            {authError && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>{authError}</span>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
              {isLogin ? '🔐 Sign In' : '🚀 Create Account & Get Started'}
            </button>
          </form>

          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isLogin ? "New here? " : "Already have an account? "}
              <span style={{ color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }} onClick={() => { setIsLogin(!isLogin); setAuthError(''); }}>
                {isLogin ? 'Create Account' : 'Sign In'}
              </span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} setTab={setActiveTab} apiBase={API_BASE} />;
      case 'exploration': return <CareerExploration user={user} updateUserProfile={updateUserProfile} apiBase={API_BASE} />;
      case 'jobs': return <JobMarketplace user={user} apiBase={API_BASE} />;
      case 'mentors': return <AlumniMentorship user={user} apiBase={API_BASE} />;
      case 'skills': return <SkillDevelopment user={user} updateUserProfile={updateUserProfile} apiBase={API_BASE} />;
      case 'employer': return <EmployerPortal user={user} apiBase={API_BASE} />;
      case 'events': return <VirtualEvents user={user} apiBase={API_BASE} />;
      case 'counseling': return <CareerCounseling user={user} apiBase={API_BASE} />;
      case 'books': return <BookExchange user={user} apiBase={API_BASE} />;
      case 'groups': return <GroupStudies user={user} apiBase={API_BASE} />;
      case 'library': return <LibraryFacilities user={user} apiBase={API_BASE} />;
      case 'hostel': return <HostelFacilities user={user} apiBase={API_BASE} />;
      case 'payment': return <CollegePayment user={user} apiBase={API_BASE} />;
      default: return <Dashboard user={user} setTab={setActiveTab} apiBase={API_BASE} />;
    }
  };

  const sidebarSection = (label) => (
    <div style={{ padding: '8px 16px 4px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '8px' }}>
      {label}
    </div>
  );

  const navItem = (tab, icon, label, roleCheck = true) => {
    if (!roleCheck) return null;
    return (
      <li key={tab} className={`sidebar-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
        {icon} <span>{label}</span>
      </li>
    );
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.4rem' }}>🎓</span>
          <span>Campus Hub</span>
        </div>

        <ul className="sidebar-menu">
          {user.role !== 'employer' && (
            <>
              {sidebarSection('Career')}
              {navItem('dashboard', <LayoutDashboard size={18} />, 'Dashboard')}
              {navItem('exploration', <TrendingUp size={18} />, 'Career Explorer')}
              {navItem('jobs', <Briefcase size={18} />, 'Job Marketplace')}
              {navItem('mentors', <Users size={18} />, 'Alumni Mentors')}
              {navItem('skills', <BookOpen size={18} />, 'Skill Courses')}
              {navItem('events', <Calendar size={18} />, 'Virtual Events')}
              {navItem('counseling', <HelpCircle size={18} />, 'Counseling')}

              {sidebarSection('Campus Life')}
              {navItem('books', <BookCopy size={18} />, 'Books Exchange')}
              {navItem('groups', <UsersRound size={18} />, 'Group Studies')}
              {navItem('library', <Library size={18} />, 'Library')}
              {navItem('hostel', <Home size={18} />, 'Hostel')}

              {user.role === 'student' && (
                <>
                  {sidebarSection('Finance')}
                  {navItem('payment', <CreditCard size={18} />, 'Pay Fees')}
                </>
              )}
            </>
          )}

          {user.role === 'employer' && (
            <>
              {sidebarSection('Employer')}
              {navItem('employer', <Shield size={18} />, 'Employer Portal')}
              {navItem('jobs', <Briefcase size={18} />, 'Job Marketplace')}
            </>
          )}
        </ul>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
            <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <div className="sidebar-item" style={{ color: 'var(--danger)', borderLeft: 'none', background: 'transparent' }} onClick={handleLogout}>
            <LogOut size={18} /> <span>Sign Out</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}

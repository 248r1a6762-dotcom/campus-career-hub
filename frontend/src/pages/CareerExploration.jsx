import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, ArrowRight, CheckCircle2, Circle, Plus, Trash2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CareerExploration({ user, updateUserProfile, apiBase }) {
  const [assessmentQuestions, setAssessmentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // questionId -> optionIndex
  const [quizFinished, setQuizFinished] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  
  const [industries, setIndustries] = useState([]);
  const [activeIndustryId, setActiveIndustryId] = useState(null);
  
  const [roadmap, setRoadmap] = useState([]);
  const [newStep, setNewStep] = useState('');
  
  const token = localStorage.getItem('token');

  // Load questions, industries, and user plan
  useEffect(() => {
    fetch(`${apiBase}/careers/assessment/questions`)
      .then(r => r.json())
      .then(data => setAssessmentQuestions(data))
      .catch(err => console.error(err));

    fetch(`${apiBase}/careers/industries`)
      .then(r => r.json())
      .then(data => setIndustries(data))
      .catch(err => console.error(err));

    if (token) {
      fetch(`${apiBase}/careers/plan`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (data.length === 0) {
          // Initialize sample steps if empty
          setRoadmap([
            { id: 1, text: "Complete Career Assessment Test", completed: true },
            { id: 2, text: "Prepare professional resume matching recommended industry", completed: false },
            { id: 3, text: "Schedule 1-on-1 alumni mentorship check-in", completed: false },
            { id: 4, text: "Apply for 3 summer internship listings", completed: false }
          ]);
        } else {
          setRoadmap(data);
        }
      })
      .catch(err => console.error(err));
    }
  }, [token, apiBase]);

  const handleOptionSelect = (optionIndex) => {
    const question = assessmentQuestions[currentQuestionIndex];
    setAnswers(prev => ({ ...prev, [question.id]: optionIndex }));
    
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished
      submitAnswers({ ...answers, [question.id]: optionIndex });
    }
  };

  const submitAnswers = (finalAnswers) => {
    fetch(`${apiBase}/careers/assessment/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ answers: finalAnswers })
    })
    .then(r => r.json())
    .then(data => {
      setRecommendations(data);
      setQuizFinished(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      
      // Update assessmentCompleted locally
      if (user) {
        const updated = {
          ...user,
          profile: {
            ...user.profile,
            assessmentCompleted: true,
            recommendedCareers: data.recommendations.map(r => r.id)
          }
        };
        updateUserProfile(updated);
      }
    })
    .catch(err => console.error(err));
  };

  const handleAddStep = (e) => {
    e.preventDefault();
    if (!newStep.trim()) return;

    const newPlan = [
      ...roadmap,
      { id: Date.now(), text: newStep, completed: false }
    ];
    saveRoadmap(newPlan);
    setNewStep('');
  };

  const handleToggleStep = (stepId) => {
    const newPlan = roadmap.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    saveRoadmap(newPlan);
  };

  const handleDeleteStep = (stepId) => {
    const newPlan = roadmap.filter(step => step.id !== stepId);
    saveRoadmap(newPlan);
  };

  const saveRoadmap = (newPlan) => {
    setRoadmap(newPlan);
    fetch(`${apiBase}/careers/plan`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan: newPlan })
    })
    .catch(err => console.error(err));
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
    setRecommendations(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Career Exploration & Assessments
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Find your strengths, discover industries, and plan your professional development steps.
        </p>
      </div>

      {/* Top Section: Interactive Assessment Quiz */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--primary)" /> Interest Assessment Test
        </h2>

        {!quizFinished ? (
          assessmentQuestions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>Loading assessment questions...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Question indicator bar */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%`, 
                  height: '100%', 
                  background: 'var(--grad-primary)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>

              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '8px' }}>
                  {assessmentQuestions[currentQuestionIndex].question}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {assessmentQuestions[currentQuestionIndex].options.map((opt, i) => (
                  <button key={i} className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'left' }} onClick={() => handleOptionSelect(i)}>
                    <HelpCircle size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center', padding: '20px 0' }}>
            <div style={{ alignSelf: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%' }}>
              <CheckCircle2 size={48} color="var(--success)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Assessment Completed!</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', marginInline: 'auto' }}>
                Based on your answers, we recommend the following professional career pathways:
              </p>
            </div>

            {/* Recommendations Grid */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
              {recommendations?.recommendations?.map((rec, i) => (
                <div key={rec.id} style={{ 
                  background: i === 0 ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)', 
                  border: i === 0 ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  padding: '20px', 
                  borderRadius: 'var(--radius-lg)',
                  width: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {i === 0 && <span className="badge badge-success" style={{ alignSelf: 'center', fontSize: '0.65rem' }}>Top Recommendation</span>}
                  <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{rec.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Salary Range: {rec.salaryRange}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Outlook: {rec.jobOutlook}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={resetQuiz}>Take Assessment Again</button>
              <button className="btn btn-secondary" onClick={() => {
                const topRec = recommendations?.recommendations[0]?.id;
                if (topRec) setActiveIndustryId(topRec);
                const el = document.getElementById('industry-directory');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}>Explore Industry Details</button>
            </div>
          </div>
        )}
      </div>

      {/* Middle Section: Industry Directory (Accordion structure) */}
      <div id="industry-directory" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Industry Profiles & Outlook</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {industries.map((ind) => {
            const isActive = activeIndustryId === ind.id;
            return (
              <div key={ind.id} style={{ 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                background: isActive ? 'rgba(255,255,255,0.02)' : 'transparent',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <button 
                  onClick={() => setActiveIndustryId(isActive ? null : ind.id)}
                  style={{
                    width: '100%',
                    padding: '20px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span>{ind.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {isActive ? 'Hide Details' : 'View Details'}
                  </span>
                </button>

                {isActive && (
                  <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{ind.description}</p>
                    
                    <div className="grid-cols-2" style={{ gap: '16px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Salary Averages</span>
                        <p style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1.1rem', marginTop: '4px' }}>{ind.salaryRange}</p>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Job Growth & Outlook</span>
                        <p style={{ fontWeight: 700, color: 'var(--info)', fontSize: '1.1rem', marginTop: '4px' }}>{ind.jobOutlook}</p>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Common Career Roles</h4>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {ind.commonRoles.map((role, idx) => (
                          <span key={idx} className="badge badge-info" style={{ fontSize: '0.7rem' }}>{role}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Required Technical & Core Skills</h4>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {ind.requiredSkills.map((skill, idx) => (
                          <span key={idx} className="badge badge-warning" style={{ fontSize: '0.7rem' }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Personalized Career Roadmap Checklist */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Personalized Career Plan & Roadmap</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-12px' }}>
          Define custom milestones and action steps to keep track of your career milestones.
        </p>

        {/* Input Add Form */}
        <form onSubmit={handleAddStep} style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Add new roadmap action step (e.g. Master React hooks, Book interview prep)..." 
            className="form-control"
            style={{ flexGrow: 1 }}
            value={newStep}
            onChange={(e) => setNewStep(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
            <Plus size={18} /> Add Step
          </button>
        </form>

        {/* Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
          {roadmap.map((step) => (
            <div key={step.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: step.completed ? 'rgba(16,185,129,0.02)' : 'rgba(255,255,255,0.01)', 
              border: '1px solid var(--border-color)', 
              padding: '16px', 
              borderRadius: 'var(--radius-md)' 
            }}>
              <div 
                onClick={() => handleToggleStep(step.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexGrow: 1 }}
              >
                {step.completed ? (
                  <CheckCircle2 size={20} color="var(--success)" />
                ) : (
                  <Circle size={20} color="var(--text-muted)" />
                )}
                <span style={{ 
                  textDecoration: step.completed ? 'line-through' : 'none',
                  color: step.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontWeight: 500
                }}>
                  {step.text}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteStep(step.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

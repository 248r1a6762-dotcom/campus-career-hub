import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Play, ChevronRight, Award, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SkillDevelopment({ user, updateUserProfile, apiBase }) {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessonProgress, setLessonProgress] = useState([]); // Array of completed indexes for selected course
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [quizSuccess, setQuizSuccess] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse && user) {
      const progress = user.profile?.courseProgress?.[selectedCourse.id] || [];
      setLessonProgress(progress);
    }
    // Reset quiz fields when shifting courses
    setSelectedAnswer(null);
    setQuizFeedback('');
    setQuizSuccess(false);
  }, [selectedCourse, user]);

  const fetchCourses = () => {
    fetch(`${apiBase}/skills/courses`)
      .then(r => r.json())
      .then(data => {
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0]);
        }
      })
      .catch(err => console.error(err));
  };

  const handleLessonComplete = (idx) => {
    if (!token || !selectedCourse) return;

    fetch(`${apiBase}/skills/lesson-complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId: selectedCourse.id,
        lessonIndex: idx
      })
    })
      .then(r => r.json())
      .then(data => {
        setLessonProgress(data.progress);
        
        // Sync local user profile state
        if (user) {
          const updatedProgress = { ...user.profile.courseProgress };
          updatedProgress[selectedCourse.id] = data.progress;
          const updatedUser = {
            ...user,
            profile: {
              ...user.profile,
              courseProgress: updatedProgress
            }
          };
          updateUserProfile(updatedUser);
        }
      })
      .catch(err => console.error(err));
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer === null || !selectedCourse) return;

    fetch(`${apiBase}/skills/quiz-submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        courseId: selectedCourse.id,
        selectedIndex: selectedAnswer
      })
    })
      .then(r => r.json())
      .then(data => {
        setQuizFeedback(data.message);
        if (data.correct) {
          setQuizSuccess(true);
          confetti({ particleCount: 120, spread: 80, colors: ['#6366f1', '#ec4899', '#10b981'] });
          
          // Sync badges in local state
          if (user) {
            const updatedBadges = data.badges;
            const updatedUser = {
              ...user,
              profile: {
                ...user.profile,
                badges: updatedBadges
              }
            };
            updateUserProfile(updatedUser);
          }
        } else {
          setQuizSuccess(false);
        }
      })
      .catch(err => console.error(err));
  };

  const isCourseQuizBadgeEarned = () => {
    if (!selectedCourse || !user?.profile?.badges) return false;
    return user.profile.badges.includes(selectedCourse.badge);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Career Skill Development
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Enhance your communication, resume templates, and tech interview capabilities to unlock verified career badges.
        </p>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.8fr', gap: '32px' }}>
        
        {/* Left Side: Course Navigation List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, paddingLeft: '8px' }}>Select Course</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {courses.map((course) => {
              const active = selectedCourse?.id === course.id;
              const hasBadge = user?.profile?.badges?.includes(course.badge);
              return (
                <div 
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: active ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    background: active ? 'rgba(99,102,241,0.05)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{course.category}</span>
                    {hasBadge && <Award size={16} color="var(--secondary)" />}
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {course.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instructor: {course.instructor}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Detailed Course Workspace panel */}
        {selectedCourse && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* General Description Card */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedCourse.title}</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Duration: {selectedCourse.duration}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{selectedCourse.description}</p>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Badge Awarded: {selectedCourse.badge}</span>
              </div>
            </div>

            {/* Grid for Lessons & Quiz */}
            <div className="grid-cols-2" style={{ alignItems: 'flex-start' }}>
              
              {/* Left Column: Lessons Completions */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={16} color="var(--primary)" /> Course Lessons
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedCourse.lessons.map((lesson, idx) => {
                    const isDone = lessonProgress.includes(idx);
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleLessonComplete(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-md)',
                          background: isDone ? 'rgba(16,185,129,0.02)' : 'rgba(255,255,255,0.01)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {isDone ? (
                            <CheckCircle size={18} color="var(--success)" />
                          ) : (
                            <Play size={16} color="var(--text-muted)" />
                          )}
                          <span style={{ fontSize: '0.85rem', fontWeight: 550, textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                            {lesson.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lesson.duration}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Interactive Quiz Card */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={16} color="var(--secondary)" /> Module Quiz
                </h3>

                {isCourseQuizBadgeEarned() ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    <Award size={48} color="var(--secondary)" style={{ filter: 'drop-shadow(0 0 10px rgba(236,72,153,0.4))' }} />
                    <h4 style={{ fontWeight: 800 }}>Badge Earned!</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      You have passed this course quiz and unlocked the verified <b>{selectedCourse.badge}</b> credential!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Answer the question below to earn your digital badge:
                    </span>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      {selectedCourse.quiz.question}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedCourse.quiz.options.map((opt, i) => (
                        <label 
                          key={i} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 14px',
                            border: selectedAnswer === i ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            background: selectedAnswer === i ? 'rgba(99,102,241,0.05)' : 'transparent',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          <input 
                            type="radio" 
                            name="quiz-opt" 
                            checked={selectedAnswer === i} 
                            onChange={() => setSelectedAnswer(i)}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    {quizFeedback && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: quizSuccess ? 'var(--success)' : 'var(--danger)' }}>
                        {quizFeedback}
                      </span>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={selectedAnswer === null}>
                      Submit Answer
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

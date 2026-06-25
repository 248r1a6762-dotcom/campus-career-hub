import React, { useState, useEffect } from 'react';
import { Search, BookOpen, MapPin, CheckCircle, BookMarked } from 'lucide-react';

export default function LibraryFacilities({ user, apiBase }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchBooks(); }, [search, category]);

  const fetchBooks = () => {
    let url = `${apiBase}/campus/library?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    fetch(url).then(r => r.json()).then(setBooks).catch(console.error);
  };

  const handleReserve = (book) => {
    if (!token) return;
    fetch(`${apiBase}/campus/library/reserve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ bookId: book._id })
    }).then(async r => {
      const data = await r.json();
      setMsg(data.message);
      setMsgType(r.ok ? 'success' : 'danger');
      if (r.ok) fetchBooks();
      setTimeout(() => setMsg(''), 5000);
    }).catch(console.error);
  };

  const availabilityColor = (avail, total) => {
    const ratio = avail / total;
    if (ratio === 0) return 'var(--danger)';
    if (ratio <= 0.3) return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🏛️ Library Facilities
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Browse the campus digital catalogue and reserve books for pickup.</p>
      </div>

      {msg && (
        <div style={{ background: `rgba(${msgType === 'success' ? '16,185,129' : '239,68,68'},0.1)`, color: `var(--${msgType})`, padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid', fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid-cols-4">
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{books.length}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Titles</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
            {books.reduce((acc, b) => acc + (b.availableCopies || 0), 0)}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Available Copies</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--warning)' }}>
            {books.reduce((acc, b) => acc + ((b.totalCopies || 0) - (b.availableCopies || 0)), 0)}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Currently Issued</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--info)' }}>{[...new Set(books.map(b => b.category))].length}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Categories</p>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input className="form-control" style={{ paddingLeft: '40px' }} placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: '180px' }} value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Finance">Finance</option>
            <option value="Design">Design</option>
            <option value="Psychology">Psychology</option>
          </select>
        </div>
      </div>

      {/* Book Catalogue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {books.map(book => (
          <div key={book._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flex: 1 }}>
              <div style={{ background: 'rgba(99,102,241,0.1)', padding: '14px', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
                <BookOpen size={28} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '1.05rem' }}>{book.title}</h3>
                  <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>{book.category}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>by {book.author} • ISBN: {book.isbn}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{book.description}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: availabilityColor(book.availableCopies, book.totalCopies) }}></div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: availabilityColor(book.availableCopies, book.totalCopies) }}>
                    {book.availableCopies}/{book.totalCopies}
                  </span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>copies free</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={12} /> {book.location}
                </div>
              </div>
              {user?.role === 'student' && (
                book.availableCopies > 0 ? (
                  <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleReserve(book)}>
                    <BookMarked size={14} /> Reserve
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled style={{ padding: '8px 16px', fontSize: '0.85rem', opacity: 0.5 }}>Not Available</button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Tag, Mail, CheckCircle, RefreshCw, Gift } from 'lucide-react';

export default function BookExchange({ user, apiBase }) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', subject: '', condition: 'Good', price: '', listingType: 'Sale' });
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchBooks(); }, [search, subjectFilter, typeFilter]);

  const fetchBooks = () => {
    let url = `${apiBase}/campus/books?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (subjectFilter) url += `subject=${encodeURIComponent(subjectFilter)}&`;
    if (typeFilter) url += `type=${encodeURIComponent(typeFilter)}&`;
    fetch(url).then(r => r.json()).then(setBooks).catch(console.error);
  };

  const handlePost = (e) => {
    e.preventDefault();
    fetch(`${apiBase}/campus/books/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 })
    }).then(async r => {
      const data = await r.json();
      if (r.ok) {
        setMsg('Book listed successfully!');
        setShowPostForm(false);
        setForm({ title: '', author: '', subject: '', condition: 'Good', price: '', listingType: 'Sale' });
        fetchBooks();
        setTimeout(() => setMsg(''), 3000);
      } else setMsg(data.message);
    }).catch(console.error);
  };

  const handleRequest = (book) => {
    fetch(`${apiBase}/campus/books/mark-unavailable`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ bookId: book._id })
    }).then(r => { if (r.ok) { setMsg(`Contact ${book.sellerEmail} to finalize.`); fetchBooks(); setTimeout(() => setMsg(''), 4000); } });
  };

  const typeColor = (t) => t === 'Sale' ? 'badge-warning' : t === 'Free' ? 'badge-success' : 'badge-info';
  const conditionColor = (c) => c === 'Excellent' ? 'var(--success)' : c === 'Good' ? 'var(--info)' : 'var(--warning)';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📚 Books Exchange
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Buy, sell, or exchange second-hand textbooks with fellow students.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowPostForm(!showPostForm)}>
          <Plus size={16} /> List a Book
        </button>
      </div>

      {msg && <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 600 }}>{msg}</div>}

      {/* Post Book Form */}
      {showPostForm && (
        <div className="card" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem' }}>📖 Post a Book Listing</h3>
          <form onSubmit={handlePost}>
            <div className="grid-cols-2" style={{ gap: '14px', marginBottom: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Book Title</label>
                <input className="form-control" placeholder="e.g. Introduction to Algorithms" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Author(s)</label>
                <input className="form-control" placeholder="e.g. CLRS" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subject / Department</label>
                <input className="form-control" placeholder="e.g. Computer Science" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Condition</label>
                <select className="form-control" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                  <option>Excellent</option><option>Good</option><option>Fair</option><option>Poor</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Listing Type</label>
                <select className="form-control" value={form.listingType} onChange={e => setForm({ ...form, listingType: e.target.value })}>
                  <option value="Sale">For Sale (₹)</option>
                  <option value="Free">Free / Donate</option>
                  <option value="Exchange">Exchange / Barter</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Price (₹) — 0 if Free/Exchange</label>
                <input className="form-control" type="number" min="0" placeholder="e.g. 450" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPostForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Publish Listing</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input className="form-control" style={{ paddingLeft: '40px' }} placeholder="Search books, authors, subjects..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: '160px' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="Sale">For Sale</option>
            <option value="Free">Free</option>
            <option value="Exchange">Exchange</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid-cols-3">
        {books.length === 0 ? (
          <div className="card" style={{ gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No books found matching your criteria.</div>
        ) : books.map(book => (
          <div key={book._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', opacity: book.available ? 1 : 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--grad-primary)', padding: '10px', borderRadius: 'var(--radius-md)', fontSize: '1.5rem' }}>📚</div>
              <span className={`badge ${typeColor(book.listingType)}`} style={{ fontSize: '0.65rem' }}>{book.listingType}</span>
            </div>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.3 }}>{book.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>by {book.author}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-info" style={{ fontSize: '0.6rem' }}>{book.subject}</span>
              <span style={{ fontSize: '0.7rem', color: conditionColor(book.condition), fontWeight: 700 }}>● {book.condition}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: book.price === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                  {book.price === 0 ? 'FREE' : `₹${book.price}`}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By: {book.sellerName}</p>
              </div>
              {book.available && user?.role === 'student' && (
                <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => handleRequest(book)}>
                  <Mail size={14} /> Contact
                </button>
              )}
              {!book.available && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Exchanged</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

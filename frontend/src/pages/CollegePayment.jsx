import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, CheckCircle, Clock, AlertTriangle, Lock, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CollegePayment({ user, apiBase }) {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');
  const token = localStorage.getItem('token');

  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = () => {
    fetch(`${apiBase}/campus/payments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).then(setInvoices).catch(console.error);
  };

  const formatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    return cleaned.match(/.{1,4}/g)?.join(' ') || '';
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setMsg('');

    // Simulate payment processing delay
    await new Promise(res => setTimeout(res, 2000));

    fetch(`${apiBase}/campus/payments/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ paymentId: selectedInvoice._id, cardNumber, cardName, expiry, cvv, upiId, paymentMethod })
    }).then(async r => {
      const data = await r.json();
      setProcessing(false);
      if (r.ok) {
        confetti({ particleCount: 150, spread: 80, colors: ['#10b981', '#6366f1', '#f59e0b'] });
        setMsg(`✅ Payment of ₹${selectedInvoice.amount.toLocaleString()} successful! Transaction ID: ${data.payment.transactionId}`);
        setMsgType('success');
        setSelectedInvoice(null);
        setCardNumber(''); setCardName(''); setExpiry(''); setCvv(''); setUpiId('');
        fetchInvoices();
      } else {
        setMsg(data.message || 'Payment failed.');
        setMsgType('danger');
      }
    }).catch(() => { setProcessing(false); setMsg('Network error.'); setMsgType('danger'); });
  };

  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  const typeIcon = (type) => {
    if (type.includes('Tuition')) return '🎓';
    if (type.includes('Hostel')) return '🏠';
    if (type.includes('Exam')) return '📝';
    if (type.includes('Library')) return '📚';
    return '💰';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          💳 College Payment Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Pay your tuition, hostel, examination, and library fees securely online.</p>
      </div>

      {msg && (
        <div style={{ background: `rgba(${msgType === 'success' ? '16,185,129' : '239,68,68'},0.1)`, color: `var(--${msgType})`, padding: '16px', borderRadius: 'var(--radius-md)', border: `1px solid rgba(${msgType === 'success' ? '16,185,129' : '239,68,68'},0.2)`, fontWeight: 600, fontSize: '0.95rem' }}>
          {msg}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid-cols-3">
        <div className="card" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', textAlign: 'center', padding: '24px' }}>
          <AlertTriangle size={28} color="var(--danger)" style={{ margin: '0 auto 8px' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--danger)' }}>₹{totalPending.toLocaleString()}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Pending</p>
        </div>
        <div className="card" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', textAlign: 'center', padding: '24px' }}>
          <CheckCircle size={28} color="var(--success)" style={{ margin: '0 auto 8px' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>₹{totalPaid.toLocaleString()}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Paid</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
          <DollarSign size={28} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{invoices.length}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Invoices</p>
        </div>
      </div>

      {/* Invoices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Fee Invoices</h3>
        {invoices.map(invoice => (
          <div key={invoice._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', border: invoice.status === 'Pending' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: invoice.status === 'Pending' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '1.4rem' }}>
                {typeIcon(invoice.type)}
              </div>
              <div>
                <h4 style={{ fontWeight: 700 }}>{invoice.type}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{invoice.description}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Invoice: {invoice.invoiceId} &nbsp;|&nbsp; Due: {invoice.dueDate}
                  {invoice.paidDate && ` | Paid: ${new Date(invoice.paidDate).toLocaleDateString()}`}
                  {invoice.transactionId && ` | TXN: ${invoice.transactionId}`}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 800, fontSize: '1.3rem' }}>₹{invoice.amount.toLocaleString()}</p>
              </div>
              {invoice.status === 'Pending' ? (
                <button className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={() => { setSelectedInvoice(invoice); setMsg(''); }}>
                  Pay Now
                </button>
              ) : (
                <span className="badge badge-success" style={{ padding: '10px 16px', fontSize: '0.75rem' }}>
                  <CheckCircle size={12} /> PAID
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Checkout Modal */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '480px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Invoice Summary */}
            <div style={{ background: 'var(--grad-primary)', padding: '20px', borderRadius: 'var(--radius-md)', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{selectedInvoice.invoiceId}</p>
                  <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginTop: '4px' }}>{selectedInvoice.type}</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '2px' }}>{selectedInvoice.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>AMOUNT DUE</p>
                  <h2 style={{ fontWeight: 800, fontSize: '2rem' }}>₹{selectedInvoice.amount.toLocaleString()}</h2>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn ${paymentMethod === 'Card' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setPaymentMethod('Card')}
              >
                <CreditCard size={16} /> Card
              </button>
              <button
                className={`btn ${paymentMethod === 'UPI' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setPaymentMethod('UPI')}
              >
                <Smartphone size={16} /> UPI
              </button>
            </div>

            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {paymentMethod === 'Card' ? (
                <>
                  {/* Animated Credit Card Preview */}
                  <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '12px', padding: '20px', color: 'white', boxShadow: '0 10px 30px rgba(99,102,241,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>CAMPUS BANK</span>
                      <span style={{ fontSize: '1.2rem' }}>💳</span>
                    </div>
                    <p style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '3px', marginBottom: '16px', fontFamily: 'monospace' }}>
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: '0.6rem', opacity: 0.7 }}>CARD HOLDER</p>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cardName || user?.name || 'YOUR NAME'}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.6rem', opacity: 0.7 }}>EXPIRES</p>
                        <p style={{ fontWeight: 700 }}>{expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Card Number</label>
                    <input className="form-control" placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} required style={{ fontFamily: 'monospace', letterSpacing: '2px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Cardholder Name</label>
                    <input className="form-control" placeholder="As on card" value={cardName} onChange={e => setCardName(e.target.value)} required />
                  </div>
                  <div className="grid-cols-2" style={{ gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Expiry (MM/YY)</label>
                      <input className="form-control" placeholder="08/28" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">CVV</label>
                      <input className="form-control" type="password" placeholder="•••" maxLength={4} value={cvv} onChange={e => setCvv(e.target.value)} required />
                    </div>
                  </div>
                </>
              ) : (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">UPI ID</label>
                  <input className="form-control" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} required />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Supports: GPay, PhonePe, Paytm, BHIM UPI
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <Lock size={12} /> 256-bit SSL encrypted • PCI-DSS compliant
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedInvoice(null)} disabled={processing}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={processing}>
                  {processing ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }}></span>
                      Processing Payment...
                    </span>
                  ) : `Pay ₹${selectedInvoice.amount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

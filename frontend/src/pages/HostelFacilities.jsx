import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Wind, Droplets, Zap, Shield, Coffee, Dumbbell, Car, Utensils, CheckCircle, Star, ChevronRight, BedDouble, BedSingle, Users, RotateCcw, Phone, AlertCircle } from 'lucide-react';

const HOSTEL_FACILITIES = [
  { icon: '📶', label: 'High-Speed WiFi', desc: '100 Mbps fiber internet in every room & common areas', category: 'connectivity' },
  { icon: '❄️', label: 'Central Air Conditioning', desc: 'Individual AC units in every room, 24/7 climate control', category: 'comfort' },
  { icon: '🍽️', label: 'Mess & Canteen', desc: '3 meals + snacks daily, veg & non-veg options with nutritional balance', category: 'food' },
  { icon: '💪', label: 'Gym & Fitness Center', desc: 'Fully equipped gymnasium with treadmills, weights & yoga space', category: 'recreation' },
  { icon: '🧺', label: 'Laundry Services', desc: 'Automated washing machines on every floor, 24/7 access', category: 'utility' },
  { icon: '🔒', label: 'CCTV & 24/7 Security', desc: 'Biometric entry, CCTV surveillance & campus security guards', category: 'safety' },
  { icon: '🏥', label: 'Medical Room', desc: 'On-campus nurse & doctor visits, first-aid & emergency protocols', category: 'health' },
  { icon: '📚', label: 'Study Rooms', desc: 'Dedicated silent study halls with whiteboards & projectors', category: 'academic' },
  { icon: '🎮', label: 'Recreation Room', desc: 'Table tennis, carom, chess, indoor sports & common TV lounge', category: 'recreation' },
  { icon: '🌳', label: 'Garden & Open Areas', desc: 'Landscaped gardens, jogging track & outdoor sports courts', category: 'outdoor' },
  { icon: '🔌', label: 'Power Backup', desc: '100% diesel generator backup, uninterrupted power supply (UPS)', category: 'utility' },
  { icon: '🚿', label: 'Hot Water 24/7', desc: 'Solar-heated + electric geyser hot water round the clock', category: 'comfort' },
  { icon: '🚌', label: 'Transport Links', desc: 'Campus shuttle bus service + auto-rickshaw stand at gate', category: 'transport' },
  { icon: '🛒', label: 'Mini Convenience Store', desc: 'Stationery, snacks, toiletries & daily essentials store on ground floor', category: 'utility' },
  { icon: '🏊', label: 'Swimming Pool', desc: 'Olympic-size pool with certified lifeguard (Block A Premium)', category: 'recreation' },
  { icon: '🅿️', label: 'Parking Facility', desc: 'Secure covered two-wheeler & four-wheeler parking available', category: 'transport' },
];

const ROOMS_DATA = [
  {
    id: 'A-101', block: 'Block A – Premium Boys', type: 'Single Occupancy', floor: 1,
    beds: 1, occupied: 0, rent: 12000,
    amenities: ['AC', 'WiFi', 'Attached Bath', 'Wardrobe', 'Study Desk', 'Balcony', 'Mini Fridge'],
    color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    size: '180 sq.ft', available: true, rating: 4.9,
    description: 'Luxury single-occupancy room with premium furnishing and private balcony.',
    floorPlan: { bed: { x: 10, y: 10, w: 35, h: 55 }, desk: { x: 55, y: 10, w: 35, h: 30 }, bath: { x: 55, y: 50, w: 35, h: 40 }, door: 'bottom' }
  },
  {
    id: 'A-205', block: 'Block A – Premium Boys', type: 'Double Sharing', floor: 2,
    beds: 2, occupied: 1, rent: 8500,
    amenities: ['AC', 'WiFi', 'Attached Bath', 'Study Desk', 'Wardrobe'],
    color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    size: '220 sq.ft', available: true, rating: 4.7,
    description: 'Spacious double-sharing with individual study zones and wardrobes.',
    floorPlan: { bed: { x: 5, y: 10, w: 35, h: 45 }, desk: { x: 5, y: 60, w: 35, h: 30 }, bath: { x: 55, y: 10, w: 35, h: 40 }, door: 'bottom' }
  },
  {
    id: 'B-103', block: 'Block B – Girls', type: 'Single Occupancy', floor: 1,
    beds: 1, occupied: 0, rent: 11000,
    amenities: ['AC', 'WiFi', 'Common Bath', 'Study Desk', 'Wardrobe', 'CCTV Floor'],
    color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)',
    size: '160 sq.ft', available: true, rating: 4.8,
    description: 'Secure girls-only block with dedicated warden, 24/7 CCTV and helpline.',
    floorPlan: { bed: { x: 10, y: 15, w: 30, h: 45 }, desk: { x: 55, y: 10, w: 30, h: 35 }, bath: { x: 55, y: 55, w: 30, h: 35 }, door: 'bottom' }
  },
  {
    id: 'B-301', block: 'Block B – Girls', type: 'Double Sharing', floor: 3,
    beds: 2, occupied: 0, rent: 7000,
    amenities: ['AC', 'WiFi', 'Common Bath', 'Study Desk', 'Balcony View'],
    color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    size: '200 sq.ft', available: true, rating: 4.6,
    description: 'Top-floor room with panoramic campus views and balcony.',
    floorPlan: { bed: { x: 5, y: 5, w: 38, h: 48 }, desk: { x: 52, y: 5, w: 38, h: 30 }, bath: { x: 52, y: 45, w: 38, h: 45 }, door: 'bottom' }
  },
  {
    id: 'C-402', block: 'Block C – Mixed PG Premium', type: 'Studio Suite', floor: 4,
    beds: 1, occupied: 0, rent: 18000,
    amenities: ['AC', 'WiFi', 'Attached Bath', 'Kitchenette', 'Sofa', 'Smart TV', 'Gym Access', 'Rooftop View'],
    color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    size: '280 sq.ft', available: true, rating: 5.0,
    description: 'Premium studio suite with kitchenette, smart TV and exclusive rooftop lounge access.',
    floorPlan: { bed: { x: 5, y: 5, w: 40, h: 45 }, desk: { x: 52, y: 5, w: 38, h: 25 }, bath: { x: 52, y: 40, w: 38, h: 50 }, door: 'bottom' }
  },
  {
    id: 'C-210', block: 'Block C – Mixed PG Premium', type: 'Triple Sharing', floor: 2,
    beds: 3, occupied: 1, rent: 5500,
    amenities: ['Fan', 'WiFi', 'Common Bath', 'Study Desk', 'Locker'],
    color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    size: '280 sq.ft', available: true, rating: 4.4,
    description: 'Budget-friendly triple room with lockers, ideal for first-year students.',
    floorPlan: { bed: { x: 3, y: 5, w: 28, h: 45 }, desk: { x: 36, y: 5, w: 25, h: 35 }, bath: { x: 66, y: 5, w: 28, h: 45 }, door: 'bottom' }
  },
];

function Room3DCard({ room, onBook, onView }) {
  const [hovered, setHovered] = useState(false);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setRotX(((y - cy) / cy) * -12);
    setRotY(((x - cx) / cx) * 12);
  };

  const handleMouseLeave = () => { setHovered(false); setRotX(0); setRotY(0); };

  const occupancyPct = (room.occupied / room.beds) * 100;
  const bedsLeft = room.beds - room.occupied;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        cursor: 'pointer',
      }}
    >
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? room.color + '60' : 'var(--border-color)'}`,
        borderRadius: '20px',
        overflow: 'hidden',
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) ${hovered ? 'translateZ(20px)' : 'translateZ(0)'}`,
        transition: hovered ? 'none' : 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease',
        boxShadow: hovered ? `0 30px 60px rgba(0,0,0,0.4), 0 0 40px ${room.color}25` : '0 4px 20px rgba(0,0,0,0.1)',
        position: 'relative',
      }}>

        {/* 3D Room Visual Top Section */}
        <div style={{
          height: '200px',
          background: room.gradient,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* 3D Room Illustration using CSS */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.15 }}>
            {/* Floor */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'rgba(0,0,0,0.3)', transform: 'perspective(300px) rotateX(60deg)', transformOrigin: 'bottom' }}></div>
            {/* Left wall */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '70%', background: 'rgba(255,255,255,0.1)', transform: 'perspective(300px) rotateY(30deg)', transformOrigin: 'left' }}></div>
            {/* Right wall */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '70%', background: 'rgba(0,0,0,0.15)', transform: 'perspective(300px) rotateY(-30deg)', transformOrigin: 'right' }}></div>
          </div>

          {/* 3D Room Interior SVG */}
          <svg width="220" height="160" viewBox="0 0 220 160" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
            {/* Back wall */}
            <polygon points="30,20 190,20 190,110 30,110" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            {/* Left side wall */}
            <polygon points="10,40 30,20 30,110 10,130" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            {/* Floor */}
            <polygon points="10,130 30,110 190,110 210,130" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            {/* Ceiling */}
            <polygon points="10,40 30,20 190,20 210,40" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>

            {/* Window */}
            <rect x="70" y="30" width="50" height="40" rx="2" fill="rgba(135,206,235,0.4)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
            <line x1="95" y1="30" x2="95" y2="70" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
            <line x1="70" y1="50" x2="120" y2="50" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>

            {/* Bed */}
            <rect x="140" y="75" width="45" height="30" rx="3" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            <rect x="140" y="75" width="45" height="10" rx="2" fill="rgba(255,255,255,0.35)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            {room.beds === 2 && <rect x="140" y="60" width="45" height="13" rx="3" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>}

            {/* Desk */}
            <rect x="35" y="80" width="35" height="20" rx="2" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
            {/* Chair */}
            <rect x="42" y="95" width="20" height="12" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>

            {/* Lamp */}
            <circle cx="160" cy="30" r="8" fill="rgba(255,220,100,0.6)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            <line x1="160" y1="38" x2="160" y2="48" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>

            {/* Door */}
            <rect x="33" y="85" width="18" height="25" rx="1" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          </svg>

          {/* Room badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
            <span style={{ background: 'rgba(0,0,0,0.4)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
              {room.type}
            </span>
          </div>

          <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '20px', backdropFilter: 'blur(8px)' }}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{room.rating}</span>
          </div>

          <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>{room.block}</p>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem' }}>Room {room.id}</h3>
          </div>

          <div style={{ position: 'absolute', bottom: '12px', right: '12px', textAlign: 'right' }}>
            <p style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem' }}>₹{room.rent.toLocaleString()}</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>per month</p>
          </div>
        </div>

        {/* Details Section */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{room.description}</p>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '10px' }}>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{room.beds}</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Beds</p>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '10px' }}>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: bedsLeft > 0 ? 'var(--success)' : 'var(--danger)' }}>{bedsLeft}</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Available</p>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '8px', borderRadius: '10px' }}>
              <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{room.size}</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Area</p>
            </div>
          </div>

          {/* Amenities */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {room.amenities.map((a, i) => {
              const emojiMap = { 'AC': '❄️', 'WiFi': '📶', 'Attached Bath': '🚿', 'Common Bath': '🚿', 'Study Desk': '📖', 'Wardrobe': '🗄️', 'Balcony': '🌅', 'Mini Fridge': '🧊', 'Kitchenette': '🍳', 'Sofa': '🛋️', 'Smart TV': '📺', 'Gym Access': '💪', 'Rooftop View': '🏙️', 'CCTV Floor': '📹', 'Locker': '🔒', 'Fan': '🌀', 'Balcony View': '🌅' };
              return (
                <span key={i} style={{ background: `${room.color}18`, border: `1px solid ${room.color}30`, color: 'var(--text-secondary)', padding: '3px 9px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600 }}>
                  {emojiMap[a] || '✓'} {a}
                </span>
              );
            })}
          </div>

          {/* Occupancy bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
              <span>Room Occupancy</span>
              <span style={{ fontWeight: 700 }}>{room.occupied}/{room.beds}</span>
            </div>
            <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${occupancyPct}%`, background: occupancyPct < 50 ? 'var(--success)' : occupancyPct < 80 ? 'var(--warning)' : 'var(--danger)', borderRadius: '3px', transition: 'width 0.6s ease' }}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '10px' }} onClick={() => onView(room)}>
              🔍 View Floor Plan
            </button>
            {bedsLeft > 0 ? (
              <button className="btn btn-primary" style={{ flex: 1.5, fontSize: '0.8rem', padding: '10px', background: room.gradient }} onClick={() => onBook(room)}>
                🏠 Book This Room
              </button>
            ) : (
              <button className="btn btn-secondary" disabled style={{ flex: 1.5, fontSize: '0.8rem', padding: '10px', opacity: 0.5 }}>Fully Occupied</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FloorPlanModal({ room, onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '600px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '1.3rem' }}>Room {room.id} — Floor Plan</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{room.type} • {room.size}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
        </div>

        {/* 3D Isometric Floor Plan */}
        <div style={{ background: '#0b0f19', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', minHeight: '320px' }}>
          {/* Grid Lines */}
          <svg width="100%" height="300" viewBox="0 0 500 300" style={{ position: 'absolute', top: 0, left: 0 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 16} x2="500" y2={i * 16} stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            ))}
            {Array.from({ length: 32 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 16} y1="0" x2={i * 16} y2="300" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            ))}
          </svg>

          <svg width="460" height="270" viewBox="0 0 460 270">
            {/* Isometric room */}
            {/* Floor */}
            <polygon points="230,200 80,130 230,60 380,130" fill={room.color + '22'} stroke={room.color + '66'} strokeWidth="2"/>
            {/* Left wall */}
            <polygon points="80,130 80,220 230,290 230,200" fill={room.color + '15'} stroke={room.color + '55'} strokeWidth="2"/>
            {/* Right wall */}
            <polygon points="380,130 380,220 230,290 230,200" fill={room.color + '10'} stroke={room.color + '44'} strokeWidth="2"/>

            {/* Furniture — Bed */}
            <g transform="translate(290, 120)">
              <polygon points="60,0 90,18 90,55 60,38" fill={room.color + '80'} stroke={room.color} strokeWidth="1.5"/>
              <polygon points="0,34 60,38 90,55 30,51" fill={room.color + '50'} stroke={room.color} strokeWidth="1.5"/>
              <polygon points="0,0 60,0 60,38 0,34" fill={room.color + '60'} stroke={room.color} strokeWidth="1.5"/>
              {/* Pillow */}
              <ellipse cx="20" cy="10" rx="15" ry="7" fill="rgba(255,255,255,0.3)" transform="rotate(-20, 20, 10)"/>
              <text x="25" y="30" fill="white" fontSize="14" opacity="0.6">🛏️</text>
            </g>

            {/* Desk */}
            <g transform="translate(100, 100)">
              <polygon points="0,0 50,0 50,28 0,28" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
              <polygon points="0,0 0,28 0,38 0,10" fill="rgba(255,255,255,0.08)" strokeWidth="0"/>
              <text x="18" y="18" fill="white" fontSize="14" opacity="0.6">📖</text>
            </g>

            {/* Window on back wall */}
            <g>
              <polygon points="195,100 235,78 235,108 195,130" fill="rgba(135,206,235,0.4)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
              <line x1="215" y1="89" x2="215" y2="119" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
            </g>

            {/* Wardrobe */}
            <g transform="translate(148, 72)">
              <polygon points="0,0 40,0 40,40 0,40" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
              <text x="10" y="25" fill="white" fontSize="14" opacity="0.5">🗄️</text>
            </g>

            {/* Bathroom door area */}
            <g transform="translate(280, 165)">
              <polygon points="0,0 55,20 55,50 0,30" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              <text x="12" y="22" fill="white" fontSize="13" opacity="0.6">🚿</text>
            </g>

            {/* Room labels */}
            <text x="220" y="145" textAnchor="middle" fill="white" fontSize="11" opacity="0.5" fontWeight="600">ROOM AREA: {room.size}</text>

            {/* Second bed if sharing */}
            {room.beds >= 2 && (
              <g transform="translate(155, 155)">
                <polygon points="60,0 90,18 90,48 60,32" fill={room.color + '70'} stroke={room.color} strokeWidth="1.5"/>
                <polygon points="0,28 60,32 90,48 30,45" fill={room.color + '45'} stroke={room.color} strokeWidth="1.5"/>
                <polygon points="0,0 60,0 60,32 0,28" fill={room.color + '55'} stroke={room.color} strokeWidth="1.5"/>
                <text x="25" y="25" fill="white" fontSize="13" opacity="0.6">🛏️</text>
              </g>
            )}
          </svg>

          {/* Legend */}
          <div style={{ position: 'absolute', bottom: '12px', right: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[['🛏️', 'Bed'], ['📖', 'Study Desk'], ['🗄️', 'Wardrobe'], ['🚿', 'Bathroom']].map(([e, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                <span>{e}</span><span>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Amenities Detail */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>Room Amenities Included</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {room.amenities.map((a, i) => (
              <span key={i} style={{ background: `${room.color}15`, border: `1px solid ${room.color}35`, color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>✓ {a}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ room, user, apiBase, onClose, onSuccess }) {
  const [form, setForm] = useState({ studentPhone: '', studentYear: '1st Year', emergencyContact: '', specialNeeds: '' });
  const [step, setStep] = useState(1); // 1: info, 2: payment, 3: confirmed
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState(user?.name || '');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  const SECURITY_DEPOSIT = 5000;
  const FIRST_MONTH = room.rent;
  const TOTAL = SECURITY_DEPOSIT + FIRST_MONTH;

  const handleBooking = async (e) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));

    try {
      const res = await fetch(`${apiBase}/campus/hostel/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ roomId: room._id || room.id, ...form })
      });
      const data = await res.json();
      setProcessing(false);
      if (res.ok) {
        setConfirmData(data.allotment || data);
        setStep(3);
        onSuccess && onSuccess();
      } else {
        setMsg(data.message || 'Booking failed. Please try again.');
      }
    } catch {
      setProcessing(false);
      setMsg('Network error.');
    }
  };

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).match(/.{1,4}/g)?.join(' ') || '';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="card" style={{ width: '540px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header */}
        <div style={{ background: room.gradient, margin: '-24px -24px 0 -24px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '20px 20px 0 0' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>{room.block}</p>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem' }}>Booking: Room {room.id}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= s ? room.color : 'rgba(255,255,255,0.05)', border: `2px solid ${step >= s ? room.color : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: step >= s ? 'white' : 'var(--text-muted)', transition: 'all 0.3s ease' }}>
                  {step > s ? '✓' : s}
                </div>
                <span style={{ fontSize: '0.75rem', color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                  {s === 1 ? 'Details' : s === 2 ? 'Payment' : 'Confirmed'}
                </span>
              </div>
              {s < 3 && <div style={{ flex: 1, height: '2px', background: step > s ? room.color : 'var(--border-color)', borderRadius: '2px', transition: 'background 0.3s ease' }}></div>}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Student Details */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input className="form-control" placeholder="+91 98765 43210" value={form.studentPhone} onChange={e => setForm({ ...form, studentPhone: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Current Academic Year</label>
              <select className="form-control" value={form.studentYear} onChange={e => setForm({ ...form, studentYear: e.target.value })}>
                <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Emergency Contact (Name + Phone)</label>
              <input className="form-control" placeholder="Parent Name — 91234 56789" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Special Requirements (Optional)</label>
              <input className="form-control" placeholder="e.g. Ground floor preferred, medical condition..." value={form.specialNeeds} onChange={e => setForm({ ...form, specialNeeds: e.target.value })} />
            </div>

            {/* Fee Breakdown */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Fee Breakdown</h4>
              {[['First Month Rent', `₹${FIRST_MONTH.toLocaleString()}`], ['Security Deposit (Refundable)', `₹${SECURITY_DEPOSIT.toLocaleString()}`]].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800 }}>Total Due Now</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: room.color }}>₹{TOTAL.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2, background: room.gradient }}>Continue to Payment →</button>
            </div>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Method Tabs */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {['Card', 'UPI', 'Net Banking'].map(m => (
                <button key={m} type="button" className={`btn ${paymentMethod === m ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1, fontSize: '0.8rem', padding: '8px', background: paymentMethod === m ? room.gradient : '' }} onClick={() => setPaymentMethod(m)}>
                  {m === 'Card' ? '💳' : m === 'UPI' ? '📱' : '🏦'} {m}
                </button>
              ))}
            </div>

            {paymentMethod === 'Card' && (
              <>
                <div style={{ background: room.gradient, borderRadius: '14px', padding: '20px 24px', color: 'white', boxShadow: `0 15px 40px ${room.color}40` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', opacity: 0.8, fontSize: '0.8rem' }}>
                    <span>CAMPUS BANK</span><span>💳</span>
                  </div>
                  <p style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '3px', marginBottom: '16px' }}>{cardNumber || '•••• •••• •••• ••••'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ fontSize: '0.6rem', opacity: 0.7 }}>CARD HOLDER</p><p style={{ fontWeight: 700 }}>{cardName || user?.name || 'YOUR NAME'}</p></div>
                    <div><p style={{ fontSize: '0.6rem', opacity: 0.7 }}>EXPIRES</p><p style={{ fontWeight: 700 }}>{expiry || 'MM/YY'}</p></div>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Card Number</label>
                  <input className="form-control" placeholder="1234 5678 9012 3456" maxLength={19} value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))} required style={{ fontFamily: 'monospace', letterSpacing: '2px' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Cardholder Name</label>
                  <input className="form-control" placeholder="As on card" value={cardName} onChange={e => setCardName(e.target.value)} required />
                </div>
                <div className="grid-cols-2" style={{ gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Expiry</label>
                    <input className="form-control" placeholder="08/28" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">CVV</label>
                    <input className="form-control" type="password" placeholder="•••" maxLength={4} value={cvv} onChange={e => setCvv(e.target.value)} required />
                  </div>
                </div>
              </>
            )}
            {paymentMethod === 'UPI' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">UPI ID</label>
                <input className="form-control" placeholder="name@upi" value={upiId} onChange={e => setUpiId(e.target.value)} required />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>GPay, PhonePe, Paytm, BHIM, Payzapp accepted</p>
              </div>
            )}
            {paymentMethod === 'Net Banking' && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Select Your Bank</label>
                <select className="form-control" required>
                  <option value="">Choose bank...</option>
                  <option>State Bank of India</option><option>HDFC Bank</option><option>ICICI Bank</option><option>Axis Bank</option><option>Kotak Mahindra</option>
                </select>
              </div>
            )}

            <div style={{ background: `${room.color}10`, border: `1px solid ${room.color}30`, borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>Total Payment</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: room.color }}>₹{TOTAL.toLocaleString()}</span>
            </div>

            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>🔒 256-bit SSL encrypted • PCI-DSS compliant</p>

            {msg && <p style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem' }}>{msg}</p>}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)} disabled={processing}>← Back</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2, background: room.gradient }} disabled={processing}>
                {processing ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }}></span>
                    Processing...
                  </span>
                ) : `Confirm & Pay ₹${TOTAL.toLocaleString()}`}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
            <div style={{ fontSize: '4rem' }}>🎉</div>
            <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--success)' }}>Room Booked Successfully!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Your hostel room has been allotted. Please visit the Hostel Office within 48 hours.</p>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Room</span>
                <span style={{ fontWeight: 700 }}>Room {room.id} — {room.block}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Type</span>
                <span style={{ fontWeight: 700 }}>{room.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Rent</span>
                <span style={{ fontWeight: 700 }}>₹{room.rent.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Paid Now</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{TOTAL.toLocaleString()}</span>
              </div>
              {confirmData?.applicationId && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Application ID</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace', color: room.color }}>{confirmData.applicationId}</span>
                </div>
              )}
            </div>
            <button className="btn btn-primary" style={{ background: room.gradient, width: '100%' }} onClick={onClose}>Done ✓</button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function HostelFacilities({ user, apiBase }) {
  const [activeSection, setActiveSection] = useState('rooms');
  const [rooms, setRooms] = useState(ROOMS_DATA);
  const [blockFilter, setBlockFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [bookingRoom, setBookingRoom] = useState(null);
  const [viewRoom, setViewRoom] = useState(null);
  const [facilityCategory, setFacilityCategory] = useState('All');

  const SECTIONS = [
    { id: 'rooms', label: '🏨 Browse Rooms', icon: '🏨' },
    { id: 'facilities', label: '🏋️ All Facilities', icon: '🏋️' },
    { id: 'rules', label: '📋 Rules & Info', icon: '📋' },
    { id: 'contact', label: '📞 Contact Warden', icon: '📞' },
  ];

  const blocks = ['All', 'Block A – Premium Boys', 'Block B – Girls', 'Block C – Mixed PG Premium'];
  const types = ['All', 'Single Occupancy', 'Double Sharing', 'Triple Sharing', 'Studio Suite'];
  const facilityCategories = ['All', 'comfort', 'food', 'recreation', 'safety', 'utility', 'academic', 'transport'];

  const filteredRooms = rooms.filter(r =>
    (blockFilter === 'All' || r.block === blockFilter) &&
    (typeFilter === 'All' || r.type === typeFilter)
  );

  const filteredFacilities = HOSTEL_FACILITIES.filter(f =>
    facilityCategory === 'All' || f.category === facilityCategory
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', borderRadius: '20px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', left: '20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '8px' }}>
          🏠 Campus Hostel Management
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: '600px' }}>
          Book your ideal hostel room with 3D previews, full facility details, and instant payment — your home away from home.
        </p>
        <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
          {[['3', 'Hostel Blocks'], ['18', 'Rooms Available'], ['16', 'Facilities'], ['24/7', 'Security']].map(([n, l]) => (
            <div key={l}>
              <p style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>{n}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-secondary)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
        {SECTIONS.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s ease',
              background: activeSection === sec.id ? 'var(--grad-primary)' : 'transparent',
              color: activeSection === sec.id ? 'white' : 'var(--text-secondary)',
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* ===== SECTION: ROOMS ===== */}
      {activeSection === 'rooms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select className="form-control" style={{ width: 'auto' }} value={blockFilter} onChange={e => setBlockFilter(e.target.value)}>
              {blocks.map(b => <option key={b}>{b}</option>)}
            </select>
            <select className="form-control" style={{ width: 'auto' }} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <span>{filteredRooms.length} rooms found</span>
            </div>
          </div>

          {/* 3D Room Cards Grid */}
          <div className="grid-cols-2" style={{ gap: '24px' }}>
            {filteredRooms.map(room => (
              <Room3DCard
                key={room.id}
                room={room}
                onBook={(r) => setBookingRoom(r)}
                onView={(r) => setViewRoom(r)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ===== SECTION: FACILITIES ===== */}
      {activeSection === 'facilities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {facilityCategories.map(cat => (
              <button key={cat} onClick={() => setFacilityCategory(cat)}
                style={{ padding: '7px 16px', border: `1px solid ${facilityCategory === cat ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '20px', background: facilityCategory === cat ? 'rgba(99,102,241,0.1)' : 'transparent', color: facilityCategory === cat ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize', fontFamily: 'var(--font-family)' }}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid-cols-3">
            {filteredFacilities.map((fac, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{fac.icon}</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{fac.label}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px', lineHeight: 1.5 }}>{fac.desc}</p>
                  <span style={{ display: 'inline-block', marginTop: '8px', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '2px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 700, textTransform: 'capitalize' }}>{fac.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== SECTION: RULES ===== */}
      {activeSection === 'rules' && (
        <div className="grid-cols-2" style={{ gap: '24px' }}>
          {[
            { title: '⏰ Timings & Curfew', items: ['Gate closes at 10:00 PM (weekdays) & 11:00 PM (weekends)', 'Mess timings: 7–9 AM, 12–2 PM, 7–9 PM', 'Visitors allowed 9 AM – 7 PM in common room only', 'Study room: open 24/7 with biometric access'] },
            { title: '🚭 Prohibited Items', items: ['No smoking, alcohol, or drugs on campus', 'No cooking appliances (heaters, induction plates) in rooms', 'No unauthorized electrical equipment', 'No pets allowed inside hostel premises'] },
            { title: '🔧 Maintenance & Requests', items: ['Raise maintenance tickets via the helpdesk app', 'Emergency repairs: call the warden 24/7 at Ext. 100', 'Room-change requests handled once per semester', 'Housekeeping: Mon, Wed, Fri 8–11 AM'] },
            { title: '💰 Fees & Deposits', items: ['Security deposit: ₹5,000 (fully refundable on exit)', 'Mess charges billed separately on 1st of every month', 'Late payment penalty: 2% per week after due date', 'Damage charges deducted from security deposit'] },
            { title: '🆘 Emergency Protocols', items: ['Fire alarm assembly point: Main Ground (Gate 1)', 'Medical emergency: Warden → Campus Medical Room → Ambulance', 'Anti-ragging helpline: 1800-180-5522', 'CCTV monitoring 24×7 across all blocks and corridors'] },
            { title: '📜 Conduct & Discipline', items: ['Maintain silence in study rooms and after 11 PM', 'Common areas must be kept clean and tidy', 'Disciplinary action for repeated violations', 'Mandatory attendance at hostel briefing sessions'] },
          ].map(section => (
            <div key={section.title} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{section.title}</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: 0, listStyle: 'none' }}>
                {section.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ===== SECTION: CONTACT ===== */}
      {activeSection === 'contact' && (
        <div className="grid-cols-2" style={{ gap: '24px' }}>
          {[
            { block: 'Block A – Boys (Premium)', warden: 'Mr. Rajesh Kumar', phone: '+91 98765 00101', ext: 'Ext. 201', email: 'warden.a@campus.edu', timing: 'Mon–Sat, 8 AM – 10 PM', emergency: '+91 98765 00100' },
            { block: 'Block B – Girls', warden: 'Mrs. Priya Sharma', phone: '+91 98765 00201', ext: 'Ext. 202', email: 'warden.b@campus.edu', timing: 'Mon–Sun, 24/7 On-site', emergency: '+91 98765 00200' },
            { block: 'Block C – Mixed PG', warden: 'Mr. Suresh Rao', phone: '+91 98765 00301', ext: 'Ext. 203', email: 'warden.c@campus.edu', timing: 'Mon–Sat, 9 AM – 9 PM', emergency: '+91 98765 00300' },
            { block: 'Chief Warden / Admin', warden: 'Dr. Anita Reddy', phone: '+91 98765 00001', ext: 'Ext. 100', email: 'chief.warden@campus.edu', timing: 'Mon–Fri, 9 AM – 5 PM', emergency: '+91 98765 00000' },
          ].map(c => (
            <div key={c.block} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ fontSize: '2rem' }}>🏠</div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.05rem' }}>{c.block}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>{c.warden}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[['📞 Phone', c.phone + ' (' + c.ext + ')'], ['📧 Email', c.email], ['🕐 Office Hours', c.timing], ['🚨 Emergency', c.emergency]].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: '10px', fontSize: '0.83rem' }}>
                    <span style={{ color: 'var(--text-muted)', minWidth: '110px' }}>{label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {viewRoom && <FloorPlanModal room={viewRoom} onClose={() => setViewRoom(null)} />}
      {bookingRoom && (
        <BookingModal
          room={bookingRoom}
          user={user}
          apiBase={apiBase}
          onClose={() => setBookingRoom(null)}
          onSuccess={() => setBookingRoom(null)}
        />
      )}
    </div>
  );
}

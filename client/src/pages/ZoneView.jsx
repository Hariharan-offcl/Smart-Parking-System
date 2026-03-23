import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getZone, getSlotsByZone, createBooking } from '../services/api';
import Navbar from '../components/Navbar';
import SlotGrid from '../components/SlotGrid';
import BookingModal from '../components/BookingModal';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';

const ZoneView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zone, setZone] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [zoneRes, slotsRes] = await Promise.all([
        getZone(id),
        getSlotsByZone(id)
      ]);
      setZone(zoneRes.data);
      setSlots(slotsRes.data);
    } catch (err) {
      toast.error('Failed to load zone data');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (bookingData) => {
    setBookingLoading(true);
    try {
      await createBooking(bookingData);
      toast.success('Slot booked successfully! Check My Bookings for your QR code.');
      setSelectedSlot(null);
      loadData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const available = slots.filter(s => s.status === 'available').length;
  const occupied = slots.filter(s => s.status === 'occupied').length;
  const reserved = slots.filter(s => s.status === 'reserved').length;

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="loading-page"><div className="spinner"></div><p>Loading zone...</p></div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-container">
        <button className="btn btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: '1rem' }}>
          <FiArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="page-header">
          <h1>{zone?.name}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FiMapPin size={14} /> {zone?.location}
          </p>
        </div>

        {}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {slots.length} Total Slots
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
              <span className="dot" style={{ background: 'var(--color-success)', width: 10, height: 10, borderRadius: '50%', display: 'inline-block' }}></span>
              {available} Available
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
              <span className="dot" style={{ background: 'var(--color-danger)', width: 10, height: 10, borderRadius: '50%', display: 'inline-block' }}></span>
              {occupied} Occupied
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
              <span className="dot" style={{ background: 'var(--color-warning)', width: 10, height: 10, borderRadius: '50%', display: 'inline-block' }}></span>
              {reserved} Reserved
            </span>
          </div>
        </div>

        <SlotGrid slots={slots} onSlotClick={(slot) => setSelectedSlot(slot)} />

        {selectedSlot && (
          <BookingModal
            slot={selectedSlot}
            zone={zone}
            onClose={() => setSelectedSlot(null)}
            onConfirm={handleBooking}
            loading={bookingLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ZoneView;

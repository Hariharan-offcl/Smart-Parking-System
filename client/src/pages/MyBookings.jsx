import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';
import Navbar from '../components/Navbar';
import QRDisplay from '../components/QRDisplay';
import toast from 'react-hot-toast';
import { FiCalendar, FiXCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data } = await getMyBookings();
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled');
      loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'badge-success';
      case 'completed': return 'badge-info';
      case 'cancelled': return 'badge-danger';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="loading-page"><div className="spinner"></div><p>Loading bookings...</p></div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>View and manage your parking reservations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No bookings yet</h3>
            <p>Go to the dashboard and book a parking slot.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="booking-card" style={{ border: 'none' }}>
                  <div className="booking-info">
                    <h4>
                      <FiCalendar size={14} style={{ marginRight: '0.3rem', verticalAlign: '-2px' }} />
                      Slot {booking.slot?.slotNumber} — {booking.zone?.name}
                    </h4>
                    <p>Vehicle: {booking.vehicleNumber} · {new Date(booking.startTime).toLocaleString()}</p>
                  </div>
                  <div className="booking-actions">
                    <span className={`badge ${getBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>

                    {booking.status === 'active' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking._id)}>
                        <FiXCircle size={14} /> Cancel
                      </button>
                    )}

                    {booking.qrCode && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                      >
                        {expandedId === booking._id ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                        QR
                      </button>
                    )}
                  </div>
                </div>

                {expandedId === booking._id && booking.qrCode && (
                  <div style={{ borderTop: '1px solid var(--border-color)', padding: '1rem' }}>
                    <QRDisplay booking={booking} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

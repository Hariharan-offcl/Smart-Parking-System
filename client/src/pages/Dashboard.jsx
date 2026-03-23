import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getZones } from '../services/api';
import Navbar from '../components/Navbar';
import { FiMapPin, FiLayers, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { HiOutlineSquares2X2 } from 'react-icons/hi2';

const Dashboard = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const { data } = await getZones();
      setZones(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalSlots = zones.reduce((sum, z) => sum + z.totalSlots, 0);
  const totalAvailable = zones.reduce((sum, z) => sum + z.availableSlots, 0);
  const totalOccupied = zones.reduce((sum, z) => sum + z.occupiedSlots, 0);
  const totalReserved = zones.reduce((sum, z) => sum + z.reservedSlots, 0);

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="loading-page"><div className="spinner"></div><p>Loading dashboard...</p></div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Parking Dashboard</h1>
          <p>Real-time overview of all parking zones</p>
        </div>

        {}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
              <FiLayers size={22} />
            </div>
            <div className="stat-info">
              <h3>{zones.length}</h3>
              <p>Total Zones</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
              <FiCheckCircle size={22} />
            </div>
            <div className="stat-info">
              <h3>{totalAvailable}</h3>
              <p>Available Slots</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
              <HiOutlineSquares2X2 size={22} />
            </div>
            <div className="stat-info">
              <h3>{totalOccupied}</h3>
              <p>Occupied Slots</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
              <FiAlertTriangle size={22} />
            </div>
            <div className="stat-info">
              <h3>{totalReserved}</h3>
              <p>Reserved Slots</p>
            </div>
          </div>
        </div>

        {}
        <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>Parking Zones</h2>
        <div className="zones-grid">
          {zones.map((zone) => {
            const availPct = zone.totalSlots > 0 ? (zone.availableSlots / zone.totalSlots) * 100 : 0;
            const barColor = availPct > 50 ? 'var(--color-success)' : availPct > 20 ? 'var(--color-warning)' : 'var(--color-danger)';

            return (
              <div
                key={zone._id}
                className="zone-card"
                onClick={() => navigate(`/zone/${zone._id}`)}
              >
                <h3>{zone.name}</h3>
                <div className="zone-location">
                  <FiMapPin size={12} /> {zone.location}
                </div>

                <div className="availability-bar">
                  <div
                    className="availability-fill"
                    style={{ width: `${availPct}%`, background: barColor }}
                  ></div>
                </div>

                <div className="zone-stats">
                  <span><span className="dot" style={{ background: 'var(--color-success)' }}></span> {zone.availableSlots} Free</span>
                  <span><span className="dot" style={{ background: 'var(--color-danger)' }}></span> {zone.occupiedSlots} Occupied</span>
                  <span><span className="dot" style={{ background: 'var(--color-warning)' }}></span> {zone.reservedSlots} Reserved</span>
                </div>
              </div>
            );
          })}
        </div>

        {zones.length === 0 && (
          <div className="empty-state">
            <div className="icon">🅿️</div>
            <h3>No parking zones yet</h3>
            <p>An admin needs to create parking zones first.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from 'react';
import { getZones, getSlotsByZone, updateSlotStatus } from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const ManageSlots = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadZones();
  }, []);

  useEffect(() => {
    if (selectedZone) loadSlots(selectedZone);
  }, [selectedZone]);

  const loadZones = async () => {
    try {
      const { data } = await getZones();
      setZones(data);
      if (data.length > 0) setSelectedZone(data[0]._id);
    } catch (err) {
      toast.error('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (zoneId) => {
    try {
      const { data } = await getSlotsByZone(zoneId);
      setSlots(data);
    } catch (err) {
      toast.error('Failed to load slots');
    }
  };

  const toggleStatus = async (slot) => {
    const nextStatus = slot.status === 'available' ? 'occupied' : 'available';
    try {
      await updateSlotStatus(slot._id, nextStatus);
      toast.success(`Slot ${slot.slotNumber} → ${nextStatus}`);
      loadSlots(selectedZone);
    } catch (err) {
      toast.error('Failed to update slot');
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Navbar />
        <div className="loading-page"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>Manage Slots</h1>
          <p>Toggle slot statuses for each zone</p>
        </div>

        <div className="form-group" style={{ maxWidth: 300 }}>
          <label>Select Zone</label>
          <select
            className="form-control"
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            {zones.map((z) => (
              <option key={z._id} value={z._id}>{z.name} — {z.location}</option>
            ))}
          </select>
        </div>

        <div className="table-wrapper" style={{ marginTop: '1rem' }}>
          <table>
            <thead>
              <tr>
                <th>Slot #</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot) => (
                <tr key={slot._id}>
                  <td style={{ fontWeight: 600 }}>{slot.slotNumber}</td>
                  <td>
                    <span className={`badge ${slot.status === 'available' ? 'badge-success' : slot.status === 'occupied' ? 'badge-danger' : 'badge-warning'}`}>
                      {slot.status}
                    </span>
                  </td>
                  <td>
                    {slot.status !== 'reserved' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleStatus(slot)}>
                        Mark {slot.status === 'available' ? 'Occupied' : 'Available'}
                      </button>
                    )}
                    {slot.status === 'reserved' && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Booked by user</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageSlots;

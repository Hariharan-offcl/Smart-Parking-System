import { useEffect, useState } from 'react';
import { getZones, createZone, deleteZone } from '../../services/api';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiMapPin } from 'react-icons/fi';

const ManageZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', totalSlots: '' });

  useEffect(() => {
    loadZones();
  }, []);

  const loadZones = async () => {
    try {
      const { data } = await getZones();
      setZones(data);
    } catch (err) {
      toast.error('Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createZone({ ...form, totalSlots: Number(form.totalSlots) });
      toast.success('Zone created with slots!');
      setForm({ name: '', location: '', totalSlots: '' });
      setShowForm(false);
      loadZones();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create zone');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this zone and all its slots?')) return;
    try {
      await deleteZone(id);
      toast.success('Zone deleted');
      loadZones();
    } catch (err) {
      toast.error('Failed to delete zone');
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
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Manage Zones</h1>
            <p>Create and manage parking zones</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <FiPlus size={16} /> New Zone
          </button>
        </div>

        {showForm && (
          <div className="card animate-in" style={{ marginBottom: '1.5rem' }}>
            <form onSubmit={handleCreate} className="admin-form">
              <div className="form-group">
                <label>Zone Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Zone E"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Engineering Block - Rooftop"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Slots</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="e.g. 30"
                  min="1"
                  value={form.totalSlots}
                  onChange={(e) => setForm({ ...form, totalSlots: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary">Create Zone</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="admin-grid">
          {zones.map((zone) => (
            <div key={zone._id} className="admin-item">
              <div className="item-info">
                <h4>{zone.name}</h4>
                <p><FiMapPin size={11} /> {zone.location}</p>
                <p>{zone.totalSlots} total · {zone.availableSlots} available</p>
              </div>
              <div className="item-actions">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(zone._id)}>
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {zones.length === 0 && (
          <div className="empty-state">
            <div className="icon">📍</div>
            <h3>No zones yet</h3>
            <p>Click "New Zone" to create your first parking zone.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageZones;

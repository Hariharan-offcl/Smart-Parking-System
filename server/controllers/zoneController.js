const ParkingZone = require('../models/ParkingZone');
const Slot = require('../models/Slot');

exports.getZones = async (req, res) => {
  try {
    const zones = await ParkingZone.find().sort({ createdAt: -1 });

    const zonesWithCounts = await Promise.all(
      zones.map(async (zone) => {
        const totalSlots = await Slot.countDocuments({ zone: zone._id });
        const availableSlots = await Slot.countDocuments({ zone: zone._id, status: 'available' });
        const occupiedSlots = await Slot.countDocuments({ zone: zone._id, status: 'occupied' });
        const reservedSlots = await Slot.countDocuments({ zone: zone._id, status: 'reserved' });

        return {
          ...zone.toObject(),
          totalSlots,
          availableSlots,
          occupiedSlots,
          reservedSlots
        };
      })
    );

    res.json(zonesWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getZone = async (req, res) => {
  try {
    const zone = await ParkingZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createZone = async (req, res) => {
  try {
    const { name, location, totalSlots } = req.body;
    const zone = await ParkingZone.create({ name, location, totalSlots });

    const slots = [];
    for (let i = 1; i <= totalSlots; i++) {
      slots.push({
        zone: zone._id,
        slotNumber: `${name.charAt(0).toUpperCase()}${String(i).padStart(3, '0')}`,
        status: 'available'
      });
    }
    await Slot.insertMany(slots);

    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateZone = async (req, res) => {
  try {
    const zone = await ParkingZone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }
    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const zone = await ParkingZone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    await Slot.deleteMany({ zone: zone._id });
    await ParkingZone.findByIdAndDelete(req.params.id);

    res.json({ message: 'Zone and associated slots deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

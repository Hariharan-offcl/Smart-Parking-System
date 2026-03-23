const Slot = require('../models/Slot');

exports.getSlotsByZone = async (req, res) => {
  try {
    const slots = await Slot.find({ zone: req.params.zoneId })
      .populate('zone', 'name location')
      .sort({ slotNumber: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateSlotStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    res.json(slot);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

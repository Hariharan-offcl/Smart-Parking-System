const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  zone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingZone',
    required: true
  },
  slotNumber: {
    type: String,
    required: [true, 'Slot number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  }
}, { timestamps: true });

slotSchema.index({ zone: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);

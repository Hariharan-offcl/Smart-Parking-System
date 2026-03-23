const mongoose = require('mongoose');

const parkingZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Zone name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  totalSlots: {
    type: Number,
    required: [true, 'Total slots is required'],
    min: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('ParkingZone', parkingZoneSchema);

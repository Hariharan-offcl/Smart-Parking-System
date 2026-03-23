const QRCode = require('qrcode');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

exports.createBooking = async (req, res) => {
  try {
    const { slotId, vehicleNumber, startTime, endTime } = req.body;

    const slot = await Slot.findOneAndUpdate(
      { _id: slotId, status: 'available' },
      { status: 'reserved' },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({ message: 'Slot is no longer available. Please choose another slot.' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      slot: slot._id,
      zone: slot.zone,
      vehicleNumber,
      startTime,
      endTime
    });

    const qrData = JSON.stringify({
      bookingId: booking._id,
      slotNumber: slot.slotNumber,
      vehicleNumber,
      startTime,
      endTime
    });
    const qrCode = await QRCode.toDataURL(qrData);

    booking.qrCode = qrCode;
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('slot', 'slotNumber')
      .populate('zone', 'name location');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('slot', 'slotNumber')
      .populate('zone', 'name location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('slot', 'slotNumber')
      .populate('zone', 'name location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    await Slot.findByIdAndUpdate(booking.slot, { status: 'available' });

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

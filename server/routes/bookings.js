const express = require('express');
const { createBooking, getMyBookings, getAllBookings, cancelBooking } = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.post('/', auth, createBooking);
router.get('/my', auth, getMyBookings);
router.get('/', auth, admin, getAllBookings);
router.patch('/:id/cancel', auth, cancelBooking);

module.exports = router;

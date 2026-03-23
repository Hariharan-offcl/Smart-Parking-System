const express = require('express');
const { getSlotsByZone, updateSlotStatus } = require('../controllers/slotController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/:zoneId', auth, getSlotsByZone);
router.patch('/:id', auth, admin, updateSlotStatus);

module.exports = router;

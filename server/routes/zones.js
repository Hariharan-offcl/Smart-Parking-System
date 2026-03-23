const express = require('express');
const { getZones, getZone, createZone, updateZone, deleteZone } = require('../controllers/zoneController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/', auth, getZones);
router.get('/:id', auth, getZone);
router.post('/', auth, admin, createZone);
router.put('/:id', auth, admin, updateZone);
router.delete('/:id', auth, admin, deleteZone);

module.exports = router;

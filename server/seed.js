const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const ParkingZone = require('./models/ParkingZone');
const Slot = require('./models/Slot');
const Booking = require('./models/Booking');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    await User.deleteMany({});
    await ParkingZone.deleteMany({});
    await Slot.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data.');

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@smartparking.com',
      password: 'admin123',
      role: 'admin'
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Users created.');

    const zones = await ParkingZone.insertMany([
      { name: 'Zone A', location: 'Main Building - Ground Floor', totalSlots: 20 },
      { name: 'Zone B', location: 'Library Block - Basement', totalSlots: 15 },
      { name: 'Zone C', location: 'Sports Complex - Open Lot', totalSlots: 25 },
      { name: 'Zone D', location: 'Admin Block - Underground', totalSlots: 10 }
    ]);

    console.log('Parking zones created.');

    for (const zone of zones) {
      const slots = [];
      for (let i = 1; i <= zone.totalSlots; i++) {

        const status = Math.random() < 0.3 ? 'occupied' : 'available';
        slots.push({
          zone: zone._id,
          slotNumber: `${zone.name.replace('Zone ', '')}${String(i).padStart(3, '0')}`,
          status
        });
      }
      await Slot.insertMany(slots);
    }

    console.log('Slots created.');
    console.log('\n--- Seed Complete ---');
    console.log('Admin login:  admin@smartparking.com / admin123');
    console.log('User  login:  john@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();

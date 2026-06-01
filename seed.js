const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts
        .slice(1)
        .join('=')
        .trim()
        .replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Define schemas to avoid ES module import syntax errors in Node.js execution
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'student'] },
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 },
});

const RegistrationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  registeredAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
const Registration =
  mongoose.models.Registration ||
  mongoose.model('Registration', RegistrationSchema);

// insp-verified
async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Clear existing data
    console.log('Clearing database collections...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    // Hash passwords
    console.log('Hashing passwords...');
    const adminPasswordHash = await bcrypt.hash('inspirante2026', 10);
    const studentPasswordHash = await bcrypt.hash('student123', 10);

    // Insert Admin
    console.log('Creating Admin account...');
    await User.create({
      name: 'Administrator',
      username: 'admin',
      password: adminPasswordHash,
      role: 'admin',
    });

    // Insert 20 Students
    const studentUsernames = [
      'asha.rao',
      'ravi.shetty',
      'meera.nair',
      'kiran.bhat',
      'divya.kamath',
      'suresh.pai',
      'ananya.hegde',
      'rohan.shenoy',
      'nisha.prabhu',
      'tejas.mallya',
      'priya.bangera',
      'sanjay.kumar',
      'sneha.reddy',
      'rahul.verma',
      'pooja.sharma',
      'vikram.singh',
      'neha.gupta',
      'arjun.patel',
      'kavitha.shekar',
      'manoj.gowda',
    ];

    console.log('Creating 20 Student accounts...');
    for (const username of studentUsernames) {
      const nameParts = username.split('.');
      const firstName =
        nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      const lastName =
        nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);

      await User.create({
        name: `${firstName} ${lastName}`,
        username: username,
        password: studentPasswordHash,
        role: 'student',
      });
    }

    // Insert 5 Events
    console.log('Creating 5 Events...');
    const events = [
      {
        name: 'Tech Symposium 2026',
        date: new Date('2026-07-10T00:00:00Z'),
        venue: 'Main Auditorium',
        capacity: 120,
      },
      {
        name: 'Hackathon',
        date: new Date('2026-07-15T00:00:00Z'),
        venue: 'Lab Block C',
        capacity: 40,
      },
      {
        name: 'Cultural Fest',
        date: new Date('2026-07-20T00:00:00Z'),
        venue: 'Open Amphitheatre',
        capacity: 300,
      },
      {
        name: 'Workshop: React Basics',
        date: new Date('2026-07-22T00:00:00Z'),
        venue: 'Seminar Hall 2',
        capacity: 30,
      },
      {
        name: 'Placement Prep Talk',
        date: new Date('2026-07-25T00:00:00Z'),
        venue: 'Main Auditorium',
        capacity: 200,
      },
    ];

    await Event.insertMany(events);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();

/**
 * Seed script to create test users with different roles
 * Run with: node scripts/seed.js
 */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// User schema (matching the one in your app)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, required: false },
  type: { 
    type: String, 
    enum: ['Admin', 'User'], 
    default: 'User',
    required: true 
  },
  role: { 
    type: String, 
    enum: ['super', 'Finance', 'HR', 'Sales'], 
    required: false
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const testUsers = [
  {
    name: 'HR Manager',
    email: 'hr@vetamed.com',
    password: 'password123',
    type: 'User',
    role: 'HR',
    status: 'accepted'
  },
  {
    name: 'Finance Director',
    email: 'finance@vetamed.com', 
    password: 'password123',
    type: 'User',
    role: 'Finance',
    status: 'accepted'
  },
  {
    name: 'Sales Manager',
    email: 'sales@vetamed.com',
    password: 'password123',
    type: 'User',
    role: 'Sales',
    status: 'accepted'
  },
  {
    name: 'Super Admin',
    email: 'admin@vetamed.com',
    password: 'password123',
    type: 'Admin',
    role: 'super',
    status: 'accepted'
  }
];

async function seedUsers() {
  try {
    // Connect to MongoDB (adjust the connection string as needed)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vetamed');
    console.log('Connected to MongoDB');

    // Check if users already exist
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`Created user: ${userData.name} (${userData.email}) with role: ${userData.role}`);
    }

    console.log('Seeding completed successfully!');
    console.log('\nTest credentials:');
    testUsers.forEach(user => {
      console.log(`${user.role}: ${user.email} / password123`);
    });

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run if called directly
if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers };

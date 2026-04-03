const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected!');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@library.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@library.com',
        password: 'password123',
        role: 'admin',
        isApproved: true
      });
      console.log('Admin user created: admin@library.com / password123');
    } else {
      console.log('Admin user already exists');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

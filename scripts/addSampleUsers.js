import { sampleUsers } from '../Data/SampleUsers.js';
import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const addSampleUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/social_media', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Hash passwords for all users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    // Insert users into database
    await UserModel.insertMany(hashedUsers);

    console.log('Sample users added successfully');
  } catch (error) {
    console.error('Error adding sample users:', error);
  } finally {
    mongoose.connection.close();
  }
};

addSampleUsers(); 
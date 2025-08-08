import mongoose from 'mongoose';

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

export default mongoose.models.User || mongoose.model('User', UserSchema);

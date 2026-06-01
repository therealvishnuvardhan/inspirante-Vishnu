import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'student'],
    },
  },
  { timestamps: true }
);

// Prevent Next.js compilation duplicate registration error
export default mongoose.models.User || mongoose.model('User', UserSchema);

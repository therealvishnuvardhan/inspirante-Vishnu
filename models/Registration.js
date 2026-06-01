import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate registrations at the database level
RegistrationSchema.index({ student: 1, event: 1 }, { unique: true });

export default mongoose.models.Registration ||
  mongoose.model('Registration', RegistrationSchema);

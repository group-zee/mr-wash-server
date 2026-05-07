import mongoose, { Schema, Document } from 'mongoose';

export interface IOTPDocument extends Document {
  phoneNumber: string;
  otp: string;
  createdAt: Date;
}

const OTPSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // OTP expires in 5 minutes
});

export const OTPModel = mongoose.model<IOTPDocument>('OTP', OTPSchema);

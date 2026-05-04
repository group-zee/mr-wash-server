import mongoose, { Document, Schema } from 'mongoose';
import { Customer } from '../../domain/Customer';

export interface ICustomerDocument extends Document, Omit<Customer, 'id'> {}

const CustomerSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Virtual for ID mapping
CustomerSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

CustomerSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret: any) {
    delete ret._id;
    delete ret.__v;
  },
});

export const CustomerModel = mongoose.model<ICustomerDocument>('Customer', CustomerSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorDocument extends Document {
  ownerName: string;
  phoneNumber: string;
  idType: string;
  idFrontUrl: string;
  idBackUrl: string | null;
  passwordHash: string;
  isVerified: boolean;
  createdAt: Date;
}

const VendorSchema = new Schema(
  {
    ownerName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    idType: { type: String, required: true },
    idFrontUrl: { type: String, required: true },
    idBackUrl: { type: String, default: null },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

VendorSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
  },
});

export const VendorModel = mongoose.model<IVendorDocument>('Vendor', VendorSchema);

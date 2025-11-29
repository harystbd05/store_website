import { Schema, model, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  invoiceCode: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: "IDR" },
    paymentStatus: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    invoiceCode: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  TransactionSchema
);

import { Schema, model, Document, Types } from "mongoose";

export interface IPaymentLogs extends Document {
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

const PaymentLogsSchema = new Schema<IPaymentLogs>(
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

export const PaymentLogs = model<IPaymentLogs>(
  "PaymentLogs",
  PaymentLogsSchema
);

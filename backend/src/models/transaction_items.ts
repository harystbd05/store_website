import { Schema, model, Document, Types } from "mongoose";

export interface ITransactionItem extends Document {
  transactionId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  subTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionItemsSchema = new Schema<ITransactionItem>(
  {
    transactionId: { type: Types.ObjectId, ref: "Transaction", required: true },
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

export const TransactionItems = model<ITransactionItem>(
  "TransactionItems",
  TransactionItemsSchema
);

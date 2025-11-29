import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  categoryId: Types.ObjectId;
  sellerId: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  platform: string;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    categoryId: { type: Types.ObjectId, ref: "Categories", required: true },
    sellerId: { type: Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    currency: { type: String, default: "IDR" },

    platform: { type: String, required: true },

    imageUrl: { type: String },

    stock: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", ProductSchema);

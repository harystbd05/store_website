import { Schema, model, Document } from "mongoose";

export interface ICategories extends Document {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategoriesSchema = new Schema<ICategories>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Categories = model<ICategories>("Categories", CategoriesSchema);

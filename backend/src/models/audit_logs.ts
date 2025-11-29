import { Schema, model, Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  userId: Types.ObjectId;
  action: string;
  description?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogsSchema = new Schema<IAuditLog>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    description: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const AuditLogs = model<IAuditLog>("AuditLogs", AuditLogsSchema);

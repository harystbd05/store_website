import { AuditLogs } from "../models/audit_logs";
export const Audit = {
  record: async (data: {
    userId: string;
    action: string;
    description?: string;
    ip?: string;
  }) => {
    await AuditLogs.create({
      userId: data.userId,
      action: data.action,
      description: data.description,
      ipAddress: data.ip,
    });
  },
};

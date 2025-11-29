import bcrypt from "bcrypt";

export class PasswordUtil {
  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async compare(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}

import jwt from "jsonwebtoken";

export class JwtUtil {
  static sign(payload: any): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
  }

  static verify(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }
}

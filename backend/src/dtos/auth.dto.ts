export class RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;

  constructor(body: any = {}) {
    this.name = String(body.name ?? "");
    this.email = String(body.email ?? "");
    this.password = String(body.password ?? "");
    this.phone = body.phone ? String(body.phone) : undefined;

    if (!this.name || !this.email || !this.password) {
      throw new Error("Missing required fields");
    }
  }
}

export class LoginDto {
  email: string;
  password: string;

  constructor(body: any = {}) {
    this.email = String(body.email ?? "");
    this.password = String(body.password ?? "");

    if (!this.email || !this.password) {
      throw new Error("Missing required fields");
    }
  }
}

export class ForgotPasswordDto {
  email: string;

  constructor(body: any = {}) {
    this.email = String(body.email ?? "");

    if (!this.email) {
      throw new Error("Email is required");
    }
  }
}

export class ResetPasswordDto {
  token: string;
  password: string;

  constructor(body: any = {}) {
    this.token = String(body.token ?? "");
    this.password = String(body.password ?? "");

    if (!this.token || !this.password) {
      throw new Error("Token and password required");
    }
  }
}

export class ChangePasswordDto {
  oldPassword: string;
  newPassword: string;

  constructor(body: any = {}) {
    this.oldPassword = String(body.oldPassword ?? "");
    this.newPassword = String(body.newPassword ?? "");

    if (!this.oldPassword || !this.newPassword) {
      throw new Error("Old & new password required");
    }
  }
}

import mongoose from "mongoose";

export class Database {
  private uri: string;

  constructor(uri?: string) {
    if (!uri && !process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    this.uri = uri || (process.env.MONGO_URI as string);
  }

  async connect(): Promise<void> {
    await mongoose.connect(this.uri);
    console.log("MongoDB connected");
  }
}

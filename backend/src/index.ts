import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/router";
import { notFoundMiddleware } from "./middlewares/notFoundMiddlewares";
import { errorMiddleware } from "./middlewares/errorMiddlewares";
import { Database } from "./config/db";

dotenv.config();

class ServerApp {
  app: express.Application;
  port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  setupMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    this.app.get("/", (_req, res) => {
      res.json({ success: true, message: "Premium App Store API" });
    });
    this.app.use("/api/v1", router);
  }

  setupErrorHandlers() {
    this.app.use(notFoundMiddleware);
    this.app.use(errorMiddleware);
  }

  async start() {
    const db = new Database();
    await db.connect();
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new ServerApp();
server.start();

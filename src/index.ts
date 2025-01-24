import cors from 'cors';
import helmet from "helmet";
import express from "express";
import compression from 'compression';
import prisma from "./config/database";
import * as os from "os";
import authRoutes from './routes/auth';
import UserRoutes from './routes/user';
import { BadRequestError, InternalServerError } from "./http_code/error-code";

import dotenv from "dotenv";
dotenv.config();
// Initialisation de l'application
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

// Routes
app.use("/auth", authRoutes);
app.use("/user", UserRoutes);

// Gestion des erreurs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Erreur détectée:", err);
    if (err instanceof BadRequestError || err instanceof InternalServerError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

const port = process.env.PORT || 8000;

function getNetworkAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface && iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// Démarrage du serveur
let server = app.listen(port, () => {
  const address = getNetworkAddress();
  console.info(`🎆 Server is running at http://${address}:${port} 🎄`);
});

export { app, server, prisma };

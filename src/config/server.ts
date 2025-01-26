// import cors from 'cors'
// import helmet from "helmet";
// import compression from 'compression';
// import { BadRequestError, InternalServerError } from "../http_code/error-code";
// import express, { Request, Response, NextFunction } from "express"; 
// import authRoutes from '../routes/auth';
// import UserRoutes from '../routes/user'

// const app = express();

// // Middlewares
// app.use(express.json());
// app.use(cors());
// app.use(helmet());
// app.use(compression());

// // Routes
// app.use("/auth", authRoutes);
// app.use("/user", UserRoutes);


// // Middleware global de gestion des erreurs (a implémenter pour éviter la gestion des trycatch a chaque controller a toi de voir)
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//     console.error("Erreur détectée:", err);
  
//     if (err instanceof BadRequestError || err instanceof InternalServerError) {
//       res.status(err.statusCode).json({ error: err.message });
//     } else {
//       res.status(500).json({ error: "Erreur interne du serveur" });
//     }
//   });

// export default app;

import { Request, Response } from 'express';
import { UnauthorizedError } from "../http_code/error-code";


// pour le moment avant que tu mette en place les jwt token (tu n'est pas obliger de les mettres en places mais c mieux)
function verifyToken(req: Request, res: Response, next: Function): void {
    const xapikey = req.headers["x-api-key"];
    if (xapikey !== process.env.X_API_KEY) {
      const error = new UnauthorizedError("Unauthorized");
      res.status(error.statusCode).json({ error: error.message });
    } else {
      next();
    }
}

export default verifyToken;
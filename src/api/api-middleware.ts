import { NextFunction, Request, Response } from 'express';
import { findApiToken } from '../models/api-token';

export class ApiMiddleware {
  async authentication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const auth = req.query.auth;

    if (auth) {
      const token = await findApiToken(auth.toString());

      if (token) {
        res.locals.channelId = token.channelId;
        next();
      } else {
        res.status(401).json({ error: 'Invalid auth token.' });
      }
    } else {
      res.status(401).json({ error: 'No auth token provided.' });
    }
  }
}

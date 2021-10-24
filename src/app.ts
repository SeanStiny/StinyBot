import express from 'express';
import { apiRouter } from './api/api-routes';

export const app = express();

// Send OK status for health checks.
app.get('/', (req, res) => {
  res.sendStatus(200);
});

// API routes.
app.use('/v1', apiRouter);

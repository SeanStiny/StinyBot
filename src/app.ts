import express from 'express';
import { apiRouter } from './api/api-routes';

export const app = express();

app.use('/api', apiRouter);

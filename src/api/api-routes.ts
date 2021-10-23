import { Router } from 'express';
import { ApiMiddleware } from './api-middleware';
import { dictionaryRouter } from './dictionary-routes';

export const apiRouter = Router();

const middleware = new ApiMiddleware();
apiRouter.use(middleware.authentication);

apiRouter.use('/dictionary', dictionaryRouter);

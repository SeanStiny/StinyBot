import { Router } from 'express';
import { DictionaryController } from './dictionary-controller';

export const dictionaryRouter = Router();

const controller = new DictionaryController();

dictionaryRouter.get('/:key', controller.byKey);
dictionaryRouter.put('/:key', controller.set);
dictionaryRouter.delete('/:key', controller.unset);

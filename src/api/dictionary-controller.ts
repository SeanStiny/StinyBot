import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';
import {
  deleteDictionaryEntry,
  DictionaryEntry,
  findDictionaryEntry,
  updateDictionaryEntry,
} from '../models/dictionary';

/**
 * Controls dictionary API calls.
 */
export class DictionaryController {
  async byKey(req: Request, res: Response, next: NextFunction): Promise<void> {
    const channelId = res.locals.channelId;
    const key = req.params.key;

    try {
      const entry = await findDictionaryEntry(channelId, key);

      if (entry) {
        res.json({
          channelId: entry.channelId,
          key: entry.key,
          value: entry.value,
        });
      } else {
        next();
      }
    } catch (reason) {
      logger.error(reason);
      next();
    }
  }

  /**
   * Set a dictionary entry.
   */
  async set(req: Request, res: Response, next: NextFunction): Promise<void> {
    const channelId = res.locals.channelId;
    const key = req.params.key;
    const value = req.body.value;

    const entry = new DictionaryEntry(channelId, key, value);
    const updated = await updateDictionaryEntry(entry);

    if (updated) {
      res.json({ channelId, key, value });
    } else {
      next(500);
    }
  }

  /**
   * Remove a dictionary entry.
   */
  async unset(req: Request, res: Response): Promise<void> {
    const channelId = res.locals.channelId;
    const key = req.params.key;

    await deleteDictionaryEntry(channelId, key);
    res.send();
  }
}

import { collections } from '../database';

/**
 * A chat command that performs an action when triggered.
 */
export interface Splatoon2Shift {
  start_time: number;
  end_time: number;
  stage?: {
    image: string;
    name: string;
  };
  weapons?: Weapon[];
}

interface Weapon {
  id: string;
  weapon: {
    id: string;
    image: string;
    name: string;
    thumbnail: string;
  };
}

/**
 * Update a Splatoon 2 salmon run shift.
 */
export async function updateSalmon(shift: Splatoon2Shift): Promise<boolean> {
  const result = await collections.salmon?.updateOne(
    {
      end_time: shift.end_time,
    },
    {
      $set: shift,
    },
    { upsert: true }
  );
  return result?.acknowledged || false;
}

/**
 * Find a Splatoon 2 salmon run shift.
 */
export async function findSalmon(time: number): Promise<Splatoon2Shift | null> {
  time = time / 1000;
  return (
    (await collections.salmon?.findOne({
      end_time: { $gt: time },
    })) || null
  );
}

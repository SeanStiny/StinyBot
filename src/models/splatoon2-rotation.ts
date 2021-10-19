import { Collection } from 'mongodb';
import { collections } from '../database';

/**
 * A chat command that performs an action when triggered.
 */
export interface Splatoon2Rotation {
  end_time: number;
  game_mode: {
    key: string;
    name: string;
  };
  id: number;
  rule: {
    key: string;
    multiline_name: string;
    name: string;
  };
  state_a: Stage;
  stage_b: Stage;
  start_time: number;
}

interface Stage {
  id: string;
  image: string;
  name: string;
}

/**
 * Update a ranked rotation.
 */
export async function updateRanked(
  rotation: Splatoon2Rotation
): Promise<boolean> {
  return await update(rotation, collections.ranked);
}

/**
 * Update a league rotation.
 */
export async function updateLeague(
  rotation: Splatoon2Rotation
): Promise<boolean> {
  return await update(rotation, collections.league);
}

/**
 * Update a turf rotation.
 */
export async function updateTurf(
  rotation: Splatoon2Rotation
): Promise<boolean> {
  return await update(rotation, collections.turf);
}

async function update(
  rotation: Splatoon2Rotation,
  collection?: Collection<Splatoon2Rotation>
): Promise<boolean> {
  const result = await collection?.updateOne(
    {
      start_time: rotation.start_time,
    },
    {
      $set: rotation,
    },
    { upsert: true }
  );
  return result?.acknowledged || false;
}

/**
 * Find a command if it exists.
 */
export async function findRanked(
  time: number
): Promise<Splatoon2Rotation | null> {
  return await find(time, collections.ranked);
}

/**
 * Find a command if it exists.
 */
export async function findLeague(
  time: number
): Promise<Splatoon2Rotation | null> {
  return await find(time, collections.league);
}

/**
 * Find a command if it exists.
 */
export async function findTurf(
  time: number
): Promise<Splatoon2Rotation | null> {
  return await find(time, collections.turf);
}

async function find(
  time: number,
  collection?: Collection<Splatoon2Rotation>
): Promise<Splatoon2Rotation | null> {
  return (
    (await collection?.findOne({
      start_time: { $lte: time },
      end_time: { $gt: time },
    })) || null
  );
}

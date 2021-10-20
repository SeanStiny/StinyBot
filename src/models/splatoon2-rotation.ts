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
  stage_a: Stage;
  stage_b: Stage;
  start_time: number;
}

interface Stage {
  id: string;
  image: string;
  name: string;
}

/**
 * Update a Splatoon 2 rotation.
 */
export async function updateRotation(
  rotation: Splatoon2Rotation,
  mode: Mode
): Promise<boolean> {
  let collection: Collection<Splatoon2Rotation> | undefined;
  if (mode === 'league') {
    collection = collections.league;
  } else if (mode === 'ranked') {
    collection = collections.ranked;
  } else {
    collection = collections.turf;
  }

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
 * Find a Splatoon 2 rotation.
 */
export async function findRotation(
  time: number,
  mode: Mode
): Promise<Splatoon2Rotation | null> {
  let collection: Collection<Splatoon2Rotation> | undefined;
  if (mode === 'league') {
    collection = collections.league;
  } else if (mode === 'ranked') {
    collection = collections.ranked;
  } else {
    collection = collections.turf;
  }

  time = time / 1000;
  return (
    (await collection?.findOne({
      start_time: { $lte: time },
      end_time: { $gt: time },
    })) || null
  );
}

type Mode = 'league' | 'ranked' | 'turf';

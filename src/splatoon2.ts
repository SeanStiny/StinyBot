import axios from 'axios';
import { config } from './config';
import { logger } from './logger';
import {
  Splatoon2Rotation,
  updateLeague,
  updateRanked,
  updateTurf,
} from './models/splatoon2-rotation';

/**
 * Splatnet request headers.
 */
const headers = {
  Host: 'app.splatoon2.nintendo.net',
  'x-unique-id': '32449507786579989234',
  'x-requested-with': 'XMLHttpRequest',
  'x-timezone-offset': '-60',
  'User-Agent':
    'Mozilla/5.0 (Linux; Android 7.1.2; Pixel Build/NJH47D; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/59.0.3071.125 Mobile Safari/537.36',
  Accept: '*/*',
  Referer: 'https://app.splatoon2.nintendo.net/home',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-GB',
  Cookie: `iksm_session=${config.splatnetCookie}`,
};

/**
 * Reload the Splatnet rotations.
 */
export async function reloadSchedule(): Promise<void> {
  const response = await axios.get<Schedule>(
    'https://app.splatoon2.nintendo.net/api/schedules',
    { headers }
  );
  const schedule = response.data;

  if (schedule) {
    schedule.gachi.forEach((rotation) => {
      updateRanked(rotation);
    });
    schedule.league.forEach((rotation) => {
      updateLeague(rotation);
    });
    schedule.regular.forEach((rotation) => {
      updateTurf(rotation);
    });
    logger.info('Splatoon 2 rotations updated.');
  }
}

interface Schedule {
  gachi: Splatoon2Rotation[];
  league: Splatoon2Rotation[];
  regular: Splatoon2Rotation[];
}

function reloadTick() {
  setTimeout(() => {
    reloadSchedule();
    reloadTick();
  }, 7200000 - (Date.now() % 7200000) + 5000).unref();
}
reloadTick();

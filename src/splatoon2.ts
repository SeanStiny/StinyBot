import axios from 'axios';
import { config } from './config';
import { logger } from './logger';
import { Splatoon2Rotation, updateRotation } from './models/splatoon2-rotation';
import { Splatoon2Shift, updateSalmon } from './models/splatoon2-salmon';

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
  // Competitive modes
  const scheduleResponse = await axios.get<Schedule>(
    'https://app.splatoon2.nintendo.net/api/schedules',
    { headers }
  );
  const schedule = scheduleResponse.data;

  if (schedule) {
    schedule.gachi.forEach((rotation) => {
      updateRotation(rotation, 'ranked');
    });
    schedule.league.forEach((rotation) => {
      updateRotation(rotation, 'league');
    });
    schedule.regular.forEach((rotation) => {
      updateRotation(rotation, 'turf');
    });
    logger.info('Splatoon 2 rotations updated.');
  }

  // Salmon Run
  const salmonResponse = await axios.get<Grizzco>(
    'https://app.splatoon2.nintendo.net/api/coop_schedules',
    { headers }
  );
  const shifts = salmonResponse.data;

  if (shifts) {
    shifts.details.forEach((shift) => {
      updateSalmon(shift);
    });
    shifts.schedules.forEach((shift) => {
      updateSalmon(shift);
    });
  }
}

interface Schedule {
  gachi: Splatoon2Rotation[];
  league: Splatoon2Rotation[];
  regular: Splatoon2Rotation[];
}

interface Grizzco {
  details: Splatoon2Shift[];
  schedules: Splatoon2Shift[];
}

function reloadTick() {
  setTimeout(() => {
    reloadSchedule();
    reloadTick();
  }, 7200000 - (Date.now() % 7200000) + 5000).unref();
}
reloadTick();

import { DateTime } from 'luxon';

// Convert a time period into a string.
export function durationString(from: DateTime, to: DateTime): string {
  const duration = to.diff(from, [
    'years',
    'months',
    'days',
    'hours',
    'minutes',
    'seconds',
  ]);
  const units: string[] = [];

  // Years
  if (duration.years > 0) {
    if (duration.years !== 1) {
      units.push(`${duration.years} years`);
    } else {
      units.push(`${duration.years} year`);
    }
  }

  // Months
  if (duration.months > 0) {
    if (duration.months !== 1) {
      units.push(`${duration.months} months`);
    } else {
      units.push(`${duration.months} month`);
    }
  }

  // Days
  if (duration.days > 0) {
    if (duration.days !== 1) {
      units.push(`${duration.days} days`);
    } else {
      units.push(`${duration.days} day`);
    }
  }

  // Only show hours or smaller if it has been less than a day.
  if (units.length === 0) {
    // Hours
    if (duration.hours !== 1) {
      units.push(`${duration.hours} hours`);
    } else {
      units.push(`${duration.hours} hour`);
    }

    // Minutes
    if (duration.minutes > 0) {
      if (duration.minutes !== 1) {
        units.push(`${duration.minutes} minutes`);
      } else {
        units.push(`${duration.minutes} minute`);
      }
    }

    // Only show seconds if it has been less than a minute.
    if (units.length === 0) {
      // Seconds
      if (duration.seconds !== 1) {
        units.push(`${duration.seconds} seconds`);
      } else {
        units.push(`${duration.seconds} second`);
      }
    }
  }

  return units.join(', ');
}

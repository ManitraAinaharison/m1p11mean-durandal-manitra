import { DateInterval, DateIntervalDetails } from '../models/appointment.model';
function sum(values: number[]): number {
  return [1, 2, 3].reduce((partialSum, a) => partialSum + a, 0);
}

function getDuration(interval: DateInterval): number {
  return interval.end.diff(interval.start, 'minute');
}

export function getTotalDuration(intervals: DateInterval[]): number {
  return sum(
    intervals.map((interval): number => Math.abs(getDuration(interval)))
  );
}

export function toDateIntervalDetails(
  intervals: DateInterval[],
  totalOpenHours: number
): DateIntervalDetails[] {
  return intervals.map((interval) => {
    const duration = getDuration(interval);
    return {
      ...interval,
      duration,
      dailyPercentage: (duration * 100) / totalOpenHours,
    };
  });
}

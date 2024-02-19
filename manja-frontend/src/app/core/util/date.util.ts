import { Dayjs } from 'dayjs';
import { DateInterval, DateIntervalDetails } from '../models/appointment.model';
function sum(values: number[]): number {
  return [1, 2, 3].reduce((partialSum, a) => partialSum + a, 0);
}
function getDiff(startDate: Dayjs, endDate: Dayjs) : number{
  return endDate.diff(startDate, 'minute');
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
  openingHour: Dayjs,
  closingHour : Dayjs
): DateIntervalDetails[] {
  console.log(openingHour.toISOString(), closingHour.toISOString())
  const totalOpenHours: number = getDiff(openingHour, closingHour);

  return intervals.map((interval) => {
    const duration = getDuration(interval);
    const dailyPercentage = (duration * 100) / totalOpenHours;
    const percentageStart = Math.floor(getDiff(openingHour, interval.start) * 100 / totalOpenHours);
    const percentageEnd = Math.floor(getDiff(openingHour, interval.end) * 100 / totalOpenHours);
    return {
      ...interval,
      duration,
      dailyPercentage,
      percentageStart,
      percentageEnd
    };
  });
}

import dayjs, { Dayjs } from 'dayjs';
import { DateInterval, DateIntervalDetails } from '../models/appointment.model';
function sum(values: number[]): number {
  return values.reduce((partialSum, a) => partialSum + a, 0);
}
function getDiff(startDate: Dayjs, endDate: Dayjs): number {
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

export function toTheSameDate(reference: Dayjs, value: Dayjs): Dayjs {
  const year = reference.year();
  const month = reference.month();
  const date = reference.date();
  return value.year(year).month(month).date(date);
}

export function createDateIntervalDetail(
  date: Dayjs,
  openingHour: Dayjs,
  closingHour: Dayjs,
  intervalDuration: number
): DateIntervalDetails {
  const end: Dayjs = date.add(intervalDuration, 'minute');
  const totalOpenHours: number = getDiff(openingHour, closingHour);
  return {
    start: date,
    end: end,
    duration: intervalDuration,
    dailyPercentage: (intervalDuration * 100) / totalOpenHours,
    percentageStart: getPercentage(openingHour, date, totalOpenHours),
    percentageEnd: getPercentage(openingHour, end, totalOpenHours),
  };
}

function getPercentage(
  openingHour: Dayjs,
  hour: Dayjs,
  totalOpenHours: number
): number {
  return Math.floor((getDiff(openingHour, hour) * 100) / totalOpenHours);
}

export function calculateHour(
  percentageStart: number,
  businessHours: DateInterval
): Dayjs {
  const businessHoursDuration = getDuration(businessHours);
  const duration = Math.floor((percentageStart * businessHoursDuration) / 100);
  return cleanSeconds(businessHours.start).add(duration, 'minute');
}

export function cleanHours(date: Dayjs): Dayjs {
  return date.hour(0).minute(0).second(0).millisecond(0);
}

export function cleanMinutess(date: Dayjs): Dayjs {
  return date.minute(0).second(0).millisecond(0);
}

export function cleanSeconds(date: Dayjs): Dayjs {
  return date.second(0).millisecond(0);
}

export function toDateIntervalDetails(
  intervals: DateInterval[],
  openingHour: Dayjs,
  closingHour: Dayjs
): DateIntervalDetails[] {
  if (intervals.length === 0) return [];
  const totalOpenHours: number = getDiff(openingHour, closingHour);
  const dateReference = intervals[0].start;
  const scheduleInterval: DateInterval = {
    start: toTheSameDate(dateReference, openingHour),
    end: toTheSameDate(dateReference, closingHour),
  };
  return intervals.map((interval) => {
    const duration = getDuration(interval);
    const dailyPercentage = (duration * 100) / totalOpenHours;
    const percentageStart = getPercentage(
      scheduleInterval.start,
      interval.start,
      totalOpenHours
    );
    const percentageEnd = getPercentage(
      scheduleInterval.start,
      interval.end,
      totalOpenHours
    );
    return {
      ...interval,
      duration,
      dailyPercentage,
      percentageStart,
      percentageEnd,
    };
  });
}

export function isOverridingNonAvailableHours(
  interval: DateIntervalDetails,
  nonAvailableHours: DateIntervalDetails[]
) {
  return nonAvailableHours.some((nonAvailableHour) => {
    return (interval.start.isAfter(nonAvailableHour.start, 'minute') &&
      interval.start.isBefore(nonAvailableHour.end, 'minute')) ||
      (interval.end.isAfter(nonAvailableHour.start, 'minute') &&
        interval.end.isBefore(nonAvailableHour.end, 'minute')) ||
      (interval.start.isBefore(nonAvailableHour.start, 'minute') &&
        interval.end.isAfter(nonAvailableHour.end, 'minute')) ||
      (interval.start.isBefore(nonAvailableHour.start, 'minute') &&
        interval.end.isAfter(nonAvailableHour.end, 'minute'));
  });
}

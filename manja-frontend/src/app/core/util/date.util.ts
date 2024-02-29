import dayjs, { Dayjs } from 'dayjs';
import { DateInterval, DateIntervalDetails, EmployeeSchedule, PrimaryDateEmployeeSchedule } from '../models/appointment.model';

function sum(values: number[]): number {
  return values.reduce((partialSum, a) => partialSum + a, 0);
}
export function getDiff(startDate: Dayjs, endDate: Dayjs): number {
  return endDate.diff(startDate, 'minute');
}

export function toSameDay(value: Dayjs, referenceDate: Dayjs): Dayjs {
    return referenceDate.hour(value.hour()).minute(value.minute());
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

export function formatHHmm(value: Dayjs){
  return value.format('HH : mm')
}

export function longDate(value: Dayjs): string {
  // return value.format('dddd, D MMMM YYYY');
  return value.calendar(dayjs(), {
    sameDay: "[Aujourd'hui le ] D MMMM YYYY",
    nextDay: '[Demain le ] D MMMM YYYY',
    nextWeek: '[La semaine prochaine, le ] D MMMM YYYY',
    lastDay: '[Hier le ] D MMMM YYYY',
    lastWeek: '[La semaine dernière, le ] D MMMM YYYY',
    sameElse: 'D MMMM YYYY [à] HH:mm', // Everything else
  });
}
export function longDateWithTime(value: Dayjs): string {
  return value.calendar(dayjs(), {
    sameDay: "[Aujourd'hui le ] D MMMM YYYY [à] HH:mm",
    nextDay: '[Demain le ] D MMMM YYYY [à] HH:mm',
    nextWeek: '[La semaine prochaine le ] D MMMM YYYY [à] HH:mm',
    lastDay: '[Hier le ] D MMMM YYYY [à] HH:mm',
    lastWeek: '[La semaine dernière le ] D MMMM YYYY [à] HH:mm',
    sameElse: 'D MMMM YYYY [à] HH:mm', // Everything else
  });
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

export function createDateIntervalDetail2(
  selectedDateInterval : DateInterval,
  businessHours : DateInterval
): DateIntervalDetails {
  const totalOpenHours: number = getDiff(businessHours.start, businessHours.end);
  const selectedIntervalDuration : number = getDiff(selectedDateInterval.start, selectedDateInterval.end);
  return {
    start: selectedDateInterval.start,
    end: selectedDateInterval.end,
    duration: selectedIntervalDuration,
    dailyPercentage: (selectedIntervalDuration * 100) / totalOpenHours,
    percentageStart: getPercentage(
      businessHours.start,
      selectedDateInterval.start,
      totalOpenHours
    ),
    percentageEnd: getPercentage(
      businessHours.start,
      selectedDateInterval.end,
      totalOpenHours
    ),
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

export function isOverlappingNonAvailableHours(
  interval: DateIntervalDetails,
  nonAvailableHours: DateIntervalDetails[]
) {
  return nonAvailableHours.some((nonAvailableHour) => {
    return (
      (interval.start.isAfter(nonAvailableHour.start, 'minute') &&
        interval.start.isBefore(nonAvailableHour.end, 'minute')) ||
      (interval.end.isAfter(nonAvailableHour.start, 'minute') &&
        interval.end.isBefore(nonAvailableHour.end, 'minute')) ||
      (interval.start.isBefore(nonAvailableHour.start, 'minute') &&
        interval.end.isAfter(nonAvailableHour.end, 'minute')) ||
      (interval.start.isBefore(nonAvailableHour.start, 'minute') &&
        interval.end.isAfter(nonAvailableHour.end, 'minute')) ||
      (interval.start.isSame(nonAvailableHour.start, 'minute') &&
        interval.end.isSame(nonAvailableHour.end, 'minute'))
    );
  });
}

export function dateToDayjs(value: Date, reference: Dayjs) : Dayjs{
  return dayjs(value)
    .year(reference.year())
    .month(reference.month())
    .date(reference.date())
    .second(0)
    .millisecond(0);
}

export function toEmployeeSchedule(schedule: PrimaryDateEmployeeSchedule, referenceDate: Dayjs) : EmployeeSchedule{
  return {
    workSchedules: schedule.workSchedules.map((workSchedule) => ({
      start: dateToDayjs(workSchedule.start, referenceDate),
      end: dateToDayjs(workSchedule.end, referenceDate),
    })),
    unavailableSchedules: schedule.unavailableSchedules.map(
      (unavailableSchedule) => ({
        start: dateToDayjs(unavailableSchedule.start, referenceDate),
        end: dateToDayjs(unavailableSchedule.end, referenceDate),
      })
    ),
  };
}

/**
 * @param {EmployeeSchedule} schedule - the employee schedule.
 * @returns {DateInterval}
 * @description Get the minimum of the schedule starts and the maximum of the schedule ends.
 */
export function calculateBusinessHours(schedule: EmployeeSchedule) : DateInterval{
  return {
    start: schedule.workSchedules.reduce((previousvalue, currentValue) => {
      if (previousvalue.start.isBefore(currentValue.start))
        return previousvalue;
      return currentValue;
    }).start,
    end: schedule.workSchedules.reduce((previousvalue, currentValue) => {
      if (previousvalue.end.isAfter(currentValue.end))
        return previousvalue;
      return currentValue;
    }).end,
  };
}

/**
 * @param {EmployeeSchedule} schedule - the employee schedule.
 * @returns {DateInterval[]}
 * @description returns all the non available hours including the hours on the schedule between the employe's schifts during the day
 */
export function calculateNonAvailableHours(schedule: EmployeeSchedule): DateInterval[]{
  const result: DateInterval[] = [];
  result.push(...schedule.unavailableSchedules);
  let length = schedule.workSchedules.length;
  for (let index = 0; index < length - 1; index++) {
    const currentElement = schedule.workSchedules[index];
    const nextElement = schedule.workSchedules[index+1];
    result.push({start: currentElement.end, end: nextElement.start})
  }
  return result;
}
import dayjs, { Dayjs } from "dayjs";
import { CalendarDate } from "../types/date.types";

export function toCalendarDates(
  dateList: Dayjs[],
  options?: { month: number; openDays: number[]; selectedDates: CalendarDate[] }
): CalendarDate[] {
  return dateList.map((d) => toCalendarDate(d, options));
}

export function toCalendarDate(
  value: Dayjs,
  options?: {
    month: number;
    openDays: number[];
    selectedDates?: CalendarDate[];
    selected?: boolean;
    highlightedDates?: Dayjs[]
  }
): CalendarDate {
  const currentDate = dayjs();
  const month = options?.month ?? currentDate.month();
  const belongsToMonth: boolean = value.month() === month;
  const isOpenDay = options?.openDays
    ? options.openDays.includes(value.day() - 1)
    : true;
  const isPriorToCurrent = value.isBefore(currentDate, 'date');
  const isHighlighted = options?.highlightedDates ? options.highlightedDates.some((highlightedDate)=>(highlightedDate.isSame(value, 'date'))): false
  return {
    value,
    isPriorToCurrent,
    belongsToMonth,
    isCurrentDate: isCurrentDate(value),
    isOpenDay,
    selectable: isOpenDay && !isPriorToCurrent,
    selected: isSelected(value, {selectedDates : options?.selectedDates, selected: options?.selected}),
    isHighlighted
  };
}

export function isCurrentDate(value: Dayjs): boolean {
  return value.isSame(dayjs(), 'date');
}

export function isSelected(value: Dayjs, options : {selectedDates?: CalendarDate[], selected?: boolean}): boolean {
  return !!(options.selected || options.selectedDates?.some((selectedDate) => selectedDate.value.isSame(value, 'date')));
}

export function cleanHMSM(value: Dayjs): Dayjs {
  return value.hour(0).minute(0).second(0).millisecond(0);
}

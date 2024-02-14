import { Component, Input } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css',
})
export class DatePickerComponent {
  weeksNumber: number = 6;
  dateRange: CalendarDate[] = [];
  weekDays: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  constructor() {
    this.generateDates();
  }

  generateDates() {
    const currentDate: Dayjs = dayjs()
      .set('hours', 0)
      .set('minutes', 0)
      .set('seconds', 0)
      .set('milliseconds', 0);
    const firstDateOfMonth: Dayjs = currentDate.date(1);
    const lastDateOfMonth: Dayjs = currentDate.endOf('month');
    const calendarDays: Dayjs[] = [];
    for (let weekday = 1; weekday < firstDateOfMonth.day(); weekday++)
      calendarDays.push(firstDateOfMonth.day(weekday));

    for (
      let date = firstDateOfMonth.date();
      date <= lastDateOfMonth.date();
      date++
    )
      calendarDays.push(firstDateOfMonth.date(date));

    const remainingDaysNumber = this.weeksNumber * 7 - calendarDays.length;
    for (
      let date = lastDateOfMonth.date();
      date <= lastDateOfMonth.date() + remainingDaysNumber;
      date++
    )
      calendarDays.push(lastDateOfMonth.date(date));

    this.setDateRange(toCalendarDates(calendarDays));
    console.log(this.dateRange)
  }

  setDateRange(range: CalendarDate[]): void {
    this.dateRange = range;
  }
}

interface CalendarDate {
  day: Dayjs;
  ofCurrentMonth: boolean;
  currentDate : boolean,
  pastDate : boolean,
  isOpenDay: boolean;
}

function toCalendarDates(
  dateList: Dayjs[],
  options?: { currentMonth: number; openDays: number[] }
): CalendarDate[] {
  return dateList.map((d) => toCalendarDate(d, options));
}

function toCalendarDate(
  value: Dayjs,
  options?: { currentMonth: number; openDays: number[] }
): CalendarDate {
  const currentMonth = options?.currentMonth ?? dayjs().month();
  const ofCurrentMonth: boolean = value.month() === currentMonth;
  const isOpenDay = options?.openDays
    ? options.openDays.includes(value.day())
    : true;
  return {
    day: value,
    currentDate:
    ofCurrentMonth,
    isOpenDay,
  };
}

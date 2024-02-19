import { Component, EventEmitter, Input, Output } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css',
})
export class DatePickerComponent {
  weeksNumber: number = 6;
  dateRange: CalendarDate[] = [];
  openDays: number[] = [0, 1, 2, 3, 4];
  weekDays = WEEKDAYS;
  @Input() referenceDate: Dayjs = dayjs();
  @Output() updateReferenceDate = new EventEmitter<Dayjs>();
  currentMonth: Month = MONTHS_FRENCH[this.referenceDate.month()];
  currentYear: number = this.referenceDate.year();
  selectedDates: CalendarDate[] = [];

  @Input()dailyNonAvailableHours : {start: Date, end: Date}[] = []

  constructor() {
    this.generateDates(this.referenceDate);
  }

  generateDates(referenceDate: Dayjs) {
    const firstDateOfMonth: Dayjs = referenceDate.date(1);
    const lastDateOfMonth: Dayjs = referenceDate.endOf('month');
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
      let date = lastDateOfMonth.date() + 1;
      date <= lastDateOfMonth.date() + remainingDaysNumber;
      date++
    )
      calendarDays.push(lastDateOfMonth.date(date));

    this.setDateRange(
      toCalendarDates(calendarDays, {
        month: this.referenceDate.month(),
        openDays: this.openDays,
        selectedDates: this.selectedDates,
      })
    );
  }

  setDateRange(range: CalendarDate[]): void {
    this.dateRange = range;
  }

  nextMonth() {
    this.changeMonth(+1);
  }

  previousMonth() {
    this.changeMonth(-1);
  }

  changeMonth(value: number) {
    const nextMonth = this.referenceDate.month(
      this.referenceDate.month() + value
    );
    this.referenceDate = nextMonth;
    this.updateValues();
  }

  updateValues() {
    this.updateReferenceDate.emit(this.referenceDate);
    this.generateDates(this.referenceDate);
    this.currentMonth = MONTHS_FRENCH[this.referenceDate.month()];
    this.currentYear = this.referenceDate.year();
  }

  selectDate(calendarDate: CalendarDate): void {
    if (!calendarDate.selectable) return;
    this.selectedDates = [{ ...calendarDate, selected: true }];
    this.updateValues();
  }
}

interface CalendarDate {
  value: Dayjs;
  isPriorToCurrent: boolean;
  belongsToMonth: boolean;
  isCurrentDate: boolean;
  isOpenDay: boolean;
  selectable: boolean;
  selected: boolean;
}

function toCalendarDates(
  dateList: Dayjs[],
  options?: { month: number; openDays: number[]; selectedDates: CalendarDate[] }
): CalendarDate[] {
  return dateList.map((d) => toCalendarDate(d, options));
}

function toCalendarDate(
  value: Dayjs,
  options?: { month: number; openDays: number[]; selectedDates: CalendarDate[] }
): CalendarDate {
  const currentDate = dayjs();
  const month = options?.month ?? currentDate.month();
  const belongsToMonth: boolean = value.month() === month;
  const isOpenDay = options?.openDays
    ? options.openDays.includes(value.day() - 1)
    : true;
  const isPriorToCurrent = value.isBefore(currentDate, 'date');
  return {
    value,
    isPriorToCurrent,
    belongsToMonth,
    isCurrentDate: isCurrentDate(value),
    isOpenDay,
    selectable: isOpenDay && !isPriorToCurrent,
    selected: isSelected(value, options?.selectedDates ?? []),
  };
}

function isCurrentDate(value: Dayjs): boolean {
  return value.isSame(dayjs(), 'date');
}

function isSelected(value: Dayjs, selectedDates: CalendarDate[]): boolean {
  return selectedDates.some((selected) => selected.value.isSame(value, 'date'));
}

function cleanHMSM(value: Dayjs): Dayjs {
  return value.hour(0).minute(0).second(0).millisecond(0);
}

const MONTHS_FRENCH = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];
type Month = (typeof MONTHS_FRENCH)[number];

const days = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche',
];

const WEEKDAYS = days.map((d) => ({ legend: d, code: d.charAt(0) }));

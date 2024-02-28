import { Component, EventEmitter, Input, Output } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { MONTHS_FRENCH, WEEKDAYS } from '../../constants/constants';
import { CalendarDate, Month } from '../../types/date.types';
import { cleanHMSM, toCalendarDates } from '../../utils/date.util';

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
  @Input({ required: true }) referenceDate: Dayjs = dayjs();
  @Input({ required: true }) selectedDates: CalendarDate[] = [];
  @Output() updateSelectedDates = new EventEmitter<Dayjs[]>();
  @Output() updateReferenceDate = new EventEmitter<Dayjs>();
  currentMonth: Month = MONTHS_FRENCH[this.referenceDate.month()];
  currentYear: number = this.referenceDate.year();

  @Input() dailyNonAvailableHours: { start: Date; end: Date }[] = [];

  constructor() {
    this.generateDates(this.referenceDate);
  }

  generateDates(referenceDate: Dayjs, selectedDates: CalendarDate[] = []) {
    const firstDateOfMonth: Dayjs = referenceDate.second(1).date(1).second(0);
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
        month: referenceDate.month(),
        openDays: this.openDays,
        selectedDates,
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
    this.currentMonth = MONTHS_FRENCH[nextMonth.month()];
    this.currentYear = nextMonth.year();
    this.generateDates(nextMonth, this.selectedDates);
    this.updateReferenceDate.emit(nextMonth);
  }

  selectDate(calendarDate: CalendarDate): void {
    if (!calendarDate.selectable) return;
    calendarDate.selected = true;
    this.updateSelectedDates.emit([calendarDate.value]);
    this.generateDates(this.referenceDate, [calendarDate]);
  }
}

function hydrationError() {
  return new Error('updateSelectedDate() is undefined');
}

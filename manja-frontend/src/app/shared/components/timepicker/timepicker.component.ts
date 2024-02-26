import { CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import {
  DateInterval,
  DateIntervalDetails,
} from '../../../core/models/appointment.model';
import {
  calculateHour,
  isOverlappingNonAvailableHours,
} from '../../../core/util/date.util';

@Component({
  selector: 'timepicker',
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.css',
})
export class TimepickerComponent {
  @Input({ required: true }) businessHours: DateInterval | null = {
    start: dayjs(),
    end: dayjs(),
  };
  @Input({ required: true }) nonAvailableHours: DateIntervalDetails[] = [];
  @Input({ required: true }) cursorInterval: DateIntervalDetails | null = null; // selectedDate
  @Input() disabled: boolean = false; // selectedDate
  @Input() errorMessage: string | null = null;

  @Output() updateSelectedDate = new EventEmitter<Dayjs>();

  @ViewChild('timepickerParent') timepickerParent: ElementRef | undefined;
  @ViewChild('timepickerCursor') timepickerCursor: ElementRef | undefined;

  position: Point = { x: 0, y: 0 };

  isCursorOnNonAvailableHours: boolean = false;

  constructor() {}

  @Output('cdkDragEnded')
  onDragEnd($event: CdkDragEnd): void {
    let y = $event.source.getFreeDragPosition().y;
    if (isNaN(y)) y = 0;
    const startTime = this.calculateCursorPointedTime(y);
    $event.source.reset();
    console.log(
      'cdkDragEnded pr : ',
      y,
      this.position.y,
      this.getParentHeight(),
      this.getYoriginalPosition(),
      this.getYposition(y),
      this.getCursorPercentageStart(y),
      startTime
    );
    if (startTime) this.updateSelectedDate.emit(startTime);
  }

  setY(value: number): void {
    this.position.y = value;
  }

  getParentHeight(): number {
    return this.timepickerParent?.nativeElement.offsetHeight;
  }

  getCursorHeight(): number {
    return this.timepickerCursor?.nativeElement.offsetHeight;
  }

  getCursorWidth(): Point {
    return this.timepickerCursor?.nativeElement.offsetHeight;
  }

  getCursorPercentageStart(yDelta: number): number {
    const position = this.getYposition(yDelta);
    return (position * 100) / this.getParentHeight();
  }

  calculateCursorPointedTime(yDelta: number): Dayjs | null {
    if (!this.businessHours) return null;
    return calculateHour(
      this.getCursorPercentageStart(yDelta),
      this.businessHours
    );
  }

  isOverlappingNonAvailableHours(): boolean {
    if (!this.cursorInterval) return false;
    return isOverlappingNonAvailableHours(
      this.cursorInterval,
      this.nonAvailableHours
    );
  }

  isPastCurrentDate(): boolean {
    if (!this.cursorInterval?.start) return false;
    return dayjs().isAfter(this.cursorInterval?.start);
  }

  getYoriginalPosition() {
    return (
      (this.getParentHeight() *
        (100 -
          (this.cursorInterval?.percentageStart as number) -
          (this.cursorInterval?.dailyPercentage as number))) /
        100 +
      this.getCursorHeight()
    );
  }

  getYposition(yDelta: number) {
    // if(!this.cursorInterval) return null;
    return (
      this.getParentHeight() -
      ((this.getYoriginalPosition() as number) - yDelta)
    );
    // return this.getParentHeight() + yDelta;
  }

  getFrontendPosition() {
    const value = this.getYoriginalPosition() - this.getCursorHeight();
    return value;
  }

  isTheSameDateAsCurrent(): boolean {
    if (!this.businessHours) return false;
    return dayjs().isSame(this.businessHours.start, 'date');
  }

  noAvailableHours(): boolean {
    return false;
  }

  isCurrentTimeAfterClosingHour(): boolean {
    if (!this.businessHours) return false;
    return dayjs().isAfter(this.businessHours.end, 'minute');
  }
}

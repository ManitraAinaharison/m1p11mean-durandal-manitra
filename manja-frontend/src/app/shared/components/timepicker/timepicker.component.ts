import { CdkDragEnd, Point } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import {
  DateInterval,
  DateIntervalDetails,
} from '../../../core/models/appointment.model';
import {
  calculateHour,
  isOverridingNonAvailableHours,
} from '../../../core/util/date.util';

@Component({
  selector: 'timepicker',
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.css',
})
export class TimepickerComponent {
  @Input({ required: true }) businessHours: DateInterval = {
    start: dayjs(),
    end: dayjs(),
  };
  @Input({ required: true }) nonAvailableHours: DateIntervalDetails[] = [];
  @Input({ required: true }) cursorInterval: DateIntervalDetails | null = null; // selectedDate
  @Input() disabled: boolean  = false; // selectedDate

  @Output() updateSelectedDate = new EventEmitter<Dayjs>();

  @ViewChild('timepickerParent') timepickerParent: ElementRef | undefined;
  @ViewChild('timepickerCursor') timepickerCursor: ElementRef | undefined;

  isCursorOnNonAvailableHours : boolean = false;

  constructor() {}

  @Output('cdkDragEnded')
  onDragEnd($event: CdkDragEnd): void {
    const y = $event.source.getFreeDragPosition().y;
    const startTime = this.calculateCursorPointedTime(y);
    this.updateSelectedDate.emit(startTime);
  }

  getParentHeight(): number {
    return this.timepickerParent?.nativeElement.offsetHeight;
  }

  getCursorWidth(): Point {
    return this.timepickerCursor?.nativeElement.offsetHeight;
  }

  getCursorPercentageStart(yDelta: number): number {
    const position = this.getYposition(yDelta);
    return (position * 100) / this.getParentHeight();
  }

  calculateCursorPointedTime(yDelta: number): Dayjs {
    return calculateHour(
      this.getCursorPercentageStart(yDelta),
      this.businessHours
    );
  }

  isOverridingNonAvailableHours(): boolean {
    if (!this.cursorInterval) return false;
    return isOverridingNonAvailableHours(
      this.cursorInterval,
      this.nonAvailableHours
    );
  }

  getYposition(yDelta: number) {
    return this.getParentHeight() + yDelta;
  }
}

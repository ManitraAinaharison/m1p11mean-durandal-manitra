import { Component, EventEmitter, Input, Output } from '@angular/core';
import dayjs, { Dayjs } from 'dayjs';
import { DateIntervalDetails } from '../../../core/models/appointment.model';

@Component({
  selector: 'timepicker',
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.css',
})
export class TimepickerComponent {
  @Input({ required: true }) openingHour: number = 0;
  @Input({ required: true }) closingHour: number = 0;
  @Input({ required: true }) nonAvailableHours: DateIntervalDetails[] = [];
  
  constructor() {}
}

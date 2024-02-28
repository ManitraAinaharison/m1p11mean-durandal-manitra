import { NgModule } from '@angular/core';
import { FormatHHmmPipe } from './formatHHmm.pipe';
import { LongDatePipe } from './longDate.pipe';
import { AppointmentStatusPipe } from './appointmentStatus.pipe';

@NgModule({
  declarations: [FormatHHmmPipe, LongDatePipe, AppointmentStatusPipe],
  exports: [FormatHHmmPipe, LongDatePipe, AppointmentStatusPipe]
})
export class SharedPipesModule {}

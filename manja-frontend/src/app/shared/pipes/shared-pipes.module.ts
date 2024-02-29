import { NgModule } from '@angular/core';
import { FormatHHmmPipe } from './formatHHmm.pipe';
import { LongDatePipe } from './longDate.pipe';
import { AppointmentStatusPipe } from './appointmentStatus.pipe';
import { RandomEmployeeQuotePipe } from './random-employee-quote.pipe';
import { ImgPathPipe } from './img-path.Pipe';

@NgModule({
  declarations: [FormatHHmmPipe, LongDatePipe, AppointmentStatusPipe, RandomEmployeeQuotePipe, ImgPathPipe],
  exports: [FormatHHmmPipe, LongDatePipe, AppointmentStatusPipe, RandomEmployeeQuotePipe, ImgPathPipe]
})
export class SharedPipesModule {}

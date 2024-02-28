import { NgModule } from '@angular/core';
import { DatePickerComponent } from './components/datepicker/datepicker.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
  imports: [CommonModule]
})
export class SharedDatePickerModule {}

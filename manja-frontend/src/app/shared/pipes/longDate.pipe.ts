import { Pipe, PipeTransform } from '@angular/core';
import { Dayjs } from 'dayjs/esm';
import { longDate } from '../../core/util/date.util';

@Pipe({
  name: 'longDate',
})
export class LongDatePipe implements PipeTransform {
  transform(value: Dayjs): string {
    return longDate(value);
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { Dayjs } from 'dayjs';
import { formatHHmm } from '../../core/util/date.util';

@Pipe({
  name: 'formatHHmm',
})
export class FormatHHmmPipe implements PipeTransform {
  transform(value: Dayjs): string {
    return formatHHmm(value);
  }
}

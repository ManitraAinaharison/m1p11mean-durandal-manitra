import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noDecimals',
})
export class NoDecimalsPipe implements PipeTransform {
  transform(value: number): string {
    return value.toFixed(0);
  }
}

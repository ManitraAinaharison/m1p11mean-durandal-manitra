import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'imgPath',
})
export class ImgPathPipe implements PipeTransform {
  transform(imgName: string): string {
    return `${environment.baseUrl}/images/${imgName}`;
  }
}

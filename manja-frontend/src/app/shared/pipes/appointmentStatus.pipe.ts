import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentStatus',
})
export class AppointmentStatusPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case 0:
        return 'Rendez-vous confirmé';
      case 1:
        return 'Case euh';
      case 2:
        return 'Case euh';
      case 3:
        return 'Case euh';
      default:
        return 'status inconnu';
    }
  }
}

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
        return 'Payé';
      case 2:
        return 'Liste d\'attente';
      case 3:
        return 'Terminé';
      case 4:
        return 'Annulé';
      default:
        return 'status inconnu';
    }
  }
}

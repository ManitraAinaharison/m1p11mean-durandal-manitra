import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../../core/services/user.service';
import { EmployeeSchedulesUpdateComponent } from '../../modals/employee-schedules-update/employee-schedules-update.component';

@Component({
    selector: 'app-employee-schedules',
    templateUrl: './employee-schedules.component.html',
    styleUrl: './employee-schedules.component.css'
})
export class EmployeeSchedulesComponent implements OnInit {

    cutIndex = 3;
    empWorkSchedule = [];
    weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    constructor(
        private dialog: MatDialog,
        public userService: UserService
    ) {}

    ngOnInit(): void {
        this.userService.currentUser.subscribe((user) => {
            this.empWorkSchedule = user!.workSchedule as [];
        });
    }

    openModal(day: number): void {
        const dialogRef = this.dialog.open(EmployeeSchedulesUpdateComponent, {
            width: '40%',
            panelClass: 'modal-container',
            backdropClass: 'modal-backdrop',
            data: {
                day: day,
                dayName: this.weekDays[day],
                start: this.printHour(day, 'start'),
                end: this.printHour(day, 'end'),
            }
        });

        dialogRef
        .afterClosed()
        .subscribe(() => {
            this.userService.getCurrentUser().subscribe();
        });
    }

    daysForFirstTable(): number[] {
        return Array.from({ length: this.cutIndex + 1 }, (_, index) => index);
    }

    daysForSecondTable(): number[] {
        return Array.from({ length: this.weekDays.length - this.cutIndex - 1 }, (_, index) => index + this.cutIndex + 1);
    }

    printHour(day: number, startOrEnd: 'start' | 'end'): string {
        const scheduleIndex = this.empWorkSchedule.findIndex((workSchedule: {day: number}) => workSchedule.day == day);
        const schedule:{
            day:number,
            schedule: {
                start: string,
                end: string
            }[]
        } = this.empWorkSchedule[scheduleIndex];
        if(schedule) {
            return schedule!.schedule[0][startOrEnd].split('T')[1].split(':00.000Z')[0];
        } else {
            return '--:--';
        }
    }
}

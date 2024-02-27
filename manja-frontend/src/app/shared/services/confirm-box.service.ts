import { Injectable } from "@angular/core";
import { ConfirmBoxComponent } from '../components/confirm-box/confirm-box.component';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";


@Injectable({
providedIn: 'root'
})
export class ConfirmBoxService {

    isLoaded: boolean = false;
    private confirm = new BehaviorSubject<boolean>(false);

    public confirm$ = this.confirm.asObservable();

    constructor(
        private dialog: MatDialog,
    ) { }

    open(title?: string, msg?: string): MatDialogRef<ConfirmBoxComponent> {
        return this.dialog.open(ConfirmBoxComponent, {
            width: '30%',
            panelClass: 'modal-container',
            backdropClass: 'modal-backdrop',
            data: {
                title: title ? title : 'Message',
                msg: msg ? msg : "Voulez-vous effectuer cette action ?"
            }
        });
    }

    confirmAction(): void {
        this.isLoaded = true;
        this.confirm.next(true);
    }

    resetConfirmAction(): void {
        this.isLoaded = false;
        this.confirm.next(false);
    }
}

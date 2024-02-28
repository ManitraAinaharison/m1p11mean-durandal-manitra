import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmBoxService } from '../../services/confirm-box.service';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrl: './confirm-box.component.css'
})
export class ConfirmBoxComponent implements OnDestroy {

  constructor(
    private confirmBoxService: ConfirmBoxService,
    private dialogRef: MatDialogRef<ConfirmBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; msg: string},
    private overlayContainer: OverlayContainer
  ) {
    this.showOverlayContainer();
  }

  private showOverlayContainer(): void {
    this.overlayContainer.getContainerElement().classList.add('custom-overlay-container');
  }

  private removeOverlayContainer(): void {
    this.overlayContainer.getContainerElement().classList.remove('custom-overlay-container');
  }

  isLoaded(): boolean {
    return this.confirmBoxService.isLoaded;
  }

  onCancelClick(): void {
    this.removeOverlayContainer();
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.confirmBoxService.confirmAction();
  }

  ngOnDestroy(): void {
    this.removeOverlayContainer();
    this.confirmBoxService.resetConfirmAction();
  }
}

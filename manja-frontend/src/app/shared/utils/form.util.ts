import { FormGroup } from "@angular/forms";


export function markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormGroup) {
            markFormGroupTouched(control);
        } else {
            control.markAsTouched();
        }
    });
}

export function fieldHasError(form: FormGroup, formControlName: string, validatorName: string): boolean {
    return form.controls[formControlName].touched && 
        form.controls[formControlName].errors && 
        form.controls[formControlName].errors![validatorName];
}
import { AbstractControl, ValidatorFn } from "@angular/forms";



export function equalValueValidator(field: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const a = control.root.get(field);
        if (a && control.value !== a.value) {
            return { 'notEqual': true };
        }
        return null;
    };
}
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

export function imageSizeValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
      const file: File = control.value;
      if (file) {
          const fileSizeInMB = file.size / (1024 * 1024);
          if (fileSizeInMB > maxSize) {
              return { 'imageSize': true };
          }
      }
      return null;
  };
}

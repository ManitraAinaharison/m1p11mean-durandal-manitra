import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";



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

export function timeValidator(time: string, time2: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
      let a = control.root.get(time) ? control.root.get(time)!.value : null;
      let b = control.root.get(time2) ? control.root.get(time2)!.value : null;
      console.log(a, b);
      if (a && b) {
        const date1 = new Date('2000-01-01T' + a);
        const date2 = new Date('2000-01-01T' + b);
        if (date2 <= date1) {
          return { 'time': true };
        }
      }
      return null;
  };
}

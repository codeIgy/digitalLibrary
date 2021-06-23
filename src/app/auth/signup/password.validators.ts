import { ValidatorFn, AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function passwordValidator(regExp: RegExp): ValidatorFn{
    return (control: AbstractControl): {[key: string]: any} | null => {
        const Matching = regExp.test(control.value);
        return Matching ? null : {nonMatching: {value: control.value}};
    };
}

export const passwordsDontMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const first = control.get('password');
    const second = control.get('passwordConfirmation');
  
    return first && second && first.value === second.value ? null:  { nonMatch: true} ;
  };
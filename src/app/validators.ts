import { FormGroup } from '@angular/forms';
import { User } from './models/user.model';

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

export function UniqueEmail(email: string, users: User[]) {    
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[email];
        users.map(elem => {
        const matchingControl = elem.email;

        if (control.value === matchingControl) {
            control.setErrors({ contains: true });
        }
    })
    }
}
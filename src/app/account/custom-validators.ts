import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Function that is created as a custom validator to check if the password and confirm password is the same for the sign up page
// Validator is a function that returns another function
export function MatchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        // Creating two variables and storing the FormControl values of password and confirmpass
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPass')?.value;

        // passwordMismatch will be returned if it is true that password does not math the confirm password
        if (password !== confirmPassword) {
            return { 'passwordMismatch': true };
        }

        // Return null means that the text boxs are empty which evaluates to being valid
        return null;
    }

}
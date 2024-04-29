import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidationFormsService {
  errorMessages: any;

  formRules = {
    nonEmpty: /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/,
    nameMin: 6,
    usernameMin: 6,
    passwordMin: 8,
    passwordPattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
    emailPattern: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/,
    codePattern: /^\d{6}$/,
  };

  formErrors = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accept: false,
  };

  constructor() {
    this.errorMessages = {
      name: {
        required: 'Name is required',
        minLength: `Name must be ${this.formRules.nameMin} characters or more`,
      },
      username: {
        required: 'Username is required',
        minLength: `Username must be ${this.formRules.usernameMin} characters or more`,
        pattern: 'Must contain letters and/or numbers, no trailing spaces',
      },
      email: {
        required: 'required',
        pattern: 'Invalid email address',
      },
      password: {
        required: 'Password is required',
        pattern:
          'Password must contain: numbers, uppercase and lowercase letters',
        minLength: `Password must be at least ${this.formRules.passwordMin} characters`,
      },
      confirmPassword: {
        required: 'Password confirmation is required',
        passwordMismatch: 'Passwords must match',
      },
      accept: {
        requiredTrue: 'You have to accept our Terms and Conditions',
      },
      code: {
        required: 'Confirmation code is required',
        pattern: 'Confirmation code have 6 digits',
      },
    };
  }
}

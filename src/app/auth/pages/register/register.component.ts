import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormFeedbackComponent,
} from '@coreui/angular';

import { AuthService } from '../../services/auth.service';
import { ValidationFormsService } from '../../services/validation-forms.service';
import { SignUpParameters } from '../../interfaces/sign-up-parameters';

/** passwords must match - custom validator */
export class PasswordValidators {
  static confirmPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    if (password?.valid && password?.value === confirm?.value) {
      confirm?.setErrors(null);
      return null;
    }
    confirm?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    CommonModule,
    FormFeedbackComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
  ],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validationFormsService = inject(ValidationFormsService);

  public formErrors = signal(this.validationFormsService.errorMessages);
  public submitted = signal(false);

  public registerForm: FormGroup = this.fb.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(this.validationFormsService.formRules.nameMin),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(
            this.validationFormsService.formRules.usernameMin
          ),
          Validators.pattern(this.validationFormsService.formRules.nonEmpty),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            this.validationFormsService.formRules.emailPattern
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(
            this.validationFormsService.formRules.passwordMin
          ),
          Validators.pattern(
            this.validationFormsService.formRules.passwordPattern
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      accept: [false, [Validators.requiredTrue]],
    },
    { validators: [PasswordValidators.confirmPassword] }
  );

  public samePassword = computed(() => {
    const { password, confirmPassword } = this.registerForm.value;
    if (password != confirmPassword) {
      return false;
    }
    return true;
  });

  async register() {
    const { name, username, email, password } = this.registerForm.value;

    sessionStorage.setItem('username', username);

    this.submitted.set(true);
    const nextStep: any = await this.authService.handleSignUp({
      name,
      username,
      email,
      password,
    });

    if (nextStep?.name) {
      alert('Username in use.');
    }

    if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP')
      this.router.navigateByUrl('/validate-code');
  }

  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }
}

// error signing up: UsernameExistsException: User already exists
//     at

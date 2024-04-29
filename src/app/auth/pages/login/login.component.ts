import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgStyle } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  FormFeedbackComponent,
} from '@coreui/angular';

import { AuthService } from '../../services/auth.service';
import { ValidationFormsService } from '../../services/validation-forms.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    CommonModule,
    FormFeedbackComponent,
  ],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validationFormsService = inject(ValidationFormsService);

  public formErrors = signal(this.validationFormsService.errorMessages);
  public submitted = signal(false);

  public loginForm: FormGroup = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(this.validationFormsService.formRules.usernameMin),
        Validators.pattern(this.validationFormsService.formRules.nonEmpty),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(this.validationFormsService.formRules.passwordMin),
        Validators.pattern(
          this.validationFormsService.formRules.passwordPattern
        ),
      ],
    ],
  });

  async login() {
    const { username, password } = this.loginForm.value;

    sessionStorage.setItem('username', username);

    this.submitted.set(true);
    const nextStep: any = await this.authService.handleSignIn({
      username,
      password,
    });

    if (nextStep?.name) {
      alert('Incorrect username or password.');
    }

    if (nextStep?.signInStep === 'DONE') {
      this.authService.checkAuthStatus();
    }
  }

  redirectToRegister() {
    this.router.navigateByUrl('/register');
  }

  logOut() {
    this.authService.handleSignOut();
  }

  constructor() {}
}

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
  public _submitted = signal(false);

  public submitted = computed(() => {
    return this._submitted();
  });

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

  login() {
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (message) => {
        console.error('Error', message, 'error');
      },
    });
  }

  redirectToRegister() {
    this.router.navigateByUrl('/register');
  }

  constructor() {}
}

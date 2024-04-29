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

@Component({
  selector: 'app-validate-code',
  templateUrl: './validate-code.component.html',
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
export class ValidateCodeComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private validationFormsService = inject(ValidationFormsService);

  public formErrors = signal(this.validationFormsService.errorMessages);

  public submitted = signal(false);

  public validateCodeForm: FormGroup = this.fb.group({
    code: [
      '',
      [
        Validators.required,
        Validators.pattern(this.validationFormsService.formRules.codePattern),
      ],
    ],
  });

  async validate() {
    const { code } = this.validateCodeForm.value;

    this.submitted.set(true);

    const username = sessionStorage.getItem('username');

    const confirmation = {
      username: username ?? '',
      confirmationCode: code.toString() ?? '',
    };

    const nextStep: any = await this.authService.handleSignUpConfirmation(
      confirmation
    );

    if (nextStep?.signUpStep === 'COMPLETE_AUTO_SIGN_IN') {
      const isSignedIn: any = await this.authService.handleAutoSignIn();

      this.assingUserValues(isSignedIn);

      this.authService.checkAuthStatus();
    }
  }
  async assingUserValues(isSignedIn: any) {
    const { username, userId } =
      await this.authService.currentAuthenticatedUser();

    console.log({ username, userId });

    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userId', userId);

    this.router.navigateByUrl('/dashboard');
  }

  redirectToLogin() {
    this.router.navigateByUrl('/login');
  }
}

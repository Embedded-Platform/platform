import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  })
  constructor(){}
  public auth = () => {
    console.log(this.loginForm)
    this.authService.login(
      this.loginForm.get('username')?.value || '',
      this.loginForm.get('password')?.value || '').subscribe({
      next: () => this.router.navigate(['/project']),
      error: (err) => console.error(err),
    });
  }
}

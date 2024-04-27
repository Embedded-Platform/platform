import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import {
  CheckTokenResponse,
  LoginResponse,
  RegisterResponse,
  User,
} from '../interfaces';
import { AuthStatus } from '../enums/auth-status.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, jwt: string): boolean {
    console.log({ user });

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);

    console.log(this.authStatus());

    localStorage.setItem('jwt', jwt);

    return true;
  }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/log-in`;
    const body = { username, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, jwt }) => this.setAuthentication(user, jwt)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  register(
    name: string,
    email: string,
    username: string,
    password: string
  ): Observable<boolean> {
    const url = `${this.baseUrl}/auth/sign-up`;
    const body = { name, email, username, password };

    return this.http.post<RegisterResponse>(url, body).pipe(
      map(({ user, jwt }) => this.setAuthentication(user, jwt)),
      catchError((err) => throwError(() => err.error.message))
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;

    const jwt = localStorage.getItem('jwt');

    if (!jwt) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      tap((x) => console.log(x)),
      map(({ user, jwt }) => this.setAuthentication(user, jwt)),
      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    localStorage.clear();
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }
}

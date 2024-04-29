import { Injectable, computed, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces';
import { AuthStatus } from '../enums/auth-status.enum';

import {
  signUp,
  confirmSignUp,
  type ConfirmSignUpInput,
  autoSignIn,
  signIn,
  type SignInInput,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  JWT,
  fetchUserAttributes,
} from 'aws-amplify/auth';

import { SignUpParameters } from '../interfaces/sign-up-parameters';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus();
  }

  private setAuthentication(user: User): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);

    return true;
  }

  async handleSignUp({
    name,
    username,
    email,
    password,
  }: SignUpParameters): Promise<any> {
    try {
      const { /*isSignUpComplete,*/ userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            name, //
            email, // E.164 number convention
          },
          // optional
          autoSignIn: true, // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
        },
      });

      console.log(userId);
      return nextStep;
    } catch (error) {
      return error;
    }
  }

  async handleSignUpConfirmation({
    username,
    confirmationCode,
  }: ConfirmSignUpInput) {
    try {
      const { /*isSignUpComplete,*/ nextStep } = await confirmSignUp({
        username,
        confirmationCode,
      });
      return nextStep;
    } catch (error) {
      return error;
    }
  }

  async handleAutoSignIn() {
    try {
      const signInOutput = await autoSignIn();

      return signInOutput;
    } catch (error) {
      return error;
    }
  }

  async handleSignIn({ username, password }: SignInInput) {
    try {
      const { /*isSignedIn,*/ nextStep } = await signIn({ username, password });
      return nextStep;
    } catch (error) {
      return error;
    }
  }

  async handleSignOut() {
    try {
      await signOut();
      console.log('out');
    } catch (error) {}
  }

  async currentAuthenticatedUser(): Promise<{
    username: string;
    userId: string;
  }> {
    try {
      const { username, userId /*, signInDetails*/ } = await getCurrentUser();

      const userInfo = {
        username,
        userId,
      };

      return userInfo;
    } catch (error) {
      return {} as any;
    }
  }

  async currentSession(): Promise<JWT> {
    try {
      const { /* accessToken,*/ idToken } =
        (await fetchAuthSession()).tokens ?? {};
      return idToken as JWT;
    } catch (error) {
      return {} as any;
    }
  }

  async checkAuthStatus(): Promise<Observable<boolean>> {
    try {
      const currentUser = await getCurrentUser();

      const user: User = {
        id: currentUser.userId,
        name: '',
        username: currentUser.username,
        email: '',
      };

      this.setAuthentication(user);

      return of(true);
    } catch (error) {
      this._authStatus.set(AuthStatus.notAuthenticated);

      return of(false);
    }
  }
}

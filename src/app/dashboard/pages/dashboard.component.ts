import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <pre> {{ currentUser() | json }} </pre>
    <pre> {{ frameworkAsSignal() | json }} </pre>
    <pre> {{ frameworkAsProperty | json }} </pre>
  `,
})
export class ChangeDetectionComponent {
  private authService = inject(AuthService);

  public currentUser = computed(() => {
    return this.authService.currentUser();
  });

  public frameworkAsSignal = signal({
    name: 'Angular',
    releaseDate: 2016,
  });

  public frameworkAsProperty = {
    name: 'Angular',
    releaseDate: 2016,
  };

  constructor() {
    setTimeout(() => {
      // this.frameworkAsProperty.name = 'React';
      this.frameworkAsSignal.update((value) => {
        value.name = 'React';

        return { ...value };
      });

      console.log('Hecho');
    }, 3000);
  }
}

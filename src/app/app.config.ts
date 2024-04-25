import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withViewTransitions } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IconSetService } from '@coreui/icons-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
        // onViewTransitionCreated( transitionInfo ) {
        //   console.log({transitionInfo});
        // },
      })
    ),
    IconSetService,
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
  ],
};

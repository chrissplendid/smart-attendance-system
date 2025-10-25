import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { CommunicatorService } from './communicator.service';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { CookieService } from 'ngx-cookie-service';
import { jwtInterceptor } from './jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), CommunicatorService, provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])), AuthGuard, CookieService]
};

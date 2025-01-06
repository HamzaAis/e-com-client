// app.config.ts
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// If you want animations:
// import { provideAnimations } from '@angular/platform-browser/animations';
// Or if you want forms globally:
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provide the HttpClient globally
    provideHttpClient(
      // If you have HTTP interceptors, you can chain them with withInterceptorsFromDi()
      withInterceptorsFromDi()
    ),
    // Provide routing using the routes you defined
    provideRouter(routes),

    // If you want animations:
    // provideAnimations(),

    // If you prefer to import forms/animations only in specific components, skip the above lines.
    // Or you can do:
    // importProvidersFrom(FormsModule, ReactiveFormsModule, BrowserAnimationsModule)
    // if you want them globally.

    // You can also provide other global services or interceptors here, e.g.:
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
};

// src/app/jwt.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

/**
 * Shared state for concurrent refresh handling
 */
const refreshSubject = new Subject<string | null>();
let refreshInProgress = false;

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const accessToken = auth.getAccessToken();

  // Attach access token if available
  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Only handle "token expired" 401 errors
      const expired =
        err.status === 401 &&
        (
          (err.error && typeof err.error === 'object' &&
            String(err.error.msg || '').toLowerCase().includes('expired')) ||
          String(err.error || '').toLowerCase().includes('token has expired') ||
          String(err.message || '').toLowerCase().includes('token')
        );

      if (!expired) {
        return throwError(() => err);
      }

      // --- Refresh flow ---
      if (!refreshInProgress) {
        refreshInProgress = true;
        refreshSubject.next(null); // signal refresh started

        return auth.refreshToken().pipe(
          switchMap((newAccessToken: string) => {
            refreshInProgress = false;
            refreshSubject.next(newAccessToken); // notify waiting requests

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` }
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            refreshInProgress = false;
            refreshSubject.next(null); // notify failure
            auth.signout(); // logout user
            return throwError(() => refreshErr);
          })
        );
      } else {
        // Wait for refresh to finish and retry with new token
        return refreshSubject.pipe(
          filter((t): t is string => !!t), // only pass non-null tokens
          take(1),
          switchMap((newToken) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(retryReq);
          })
        );
      }
    })
  );
};

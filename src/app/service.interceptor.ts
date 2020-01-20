import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ServiceInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //WTS TODO: You can personalize your http interception (token for login, handle errors, redirections, loggers ...)
    //More information in:
    //https://angular.io/api/common/http/HttpInterceptor
    //https://blog.angulartraining.com/http-interceptors-in-angular-61dcf80b6bdd

    return next.handle(
      req.clone({
        headers: req.headers.append('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMjA0NjEyZWRkMDZjNGFmMjgyZTdmNSIsImlhdCI6MTU3OTUxODc0MywiZXhwIjoxNTgyMTEwNzQzfQ.nKV-rvnCRizODzwBkYy02iYLQtOabRj2uWVBRVZODf4')
      })
    ).pipe(
      catchError(err => throwError(err))
    );
  }

}
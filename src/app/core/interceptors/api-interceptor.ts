import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private baseUrl: string = environment.baseURL;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let baseUrl: string = this.baseUrl;
    let url: string = req.url;

    if (url.includes('/assets')) {
      baseUrl = window.location.origin;
      url = url.startsWith('.') ? url.replace(/^[.]+/, '') : url;
    }

    const currUrl = url.startsWith('/') ? url : `/${url}`;

    req = req.clone({
      url: `${baseUrl}${currUrl}`,
    });

    return next.handle(req);
  }
}

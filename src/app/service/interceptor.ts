import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  kinveyAppKey = 'kid_ryf8NPqt_';
  kinveyAppSecret = '202b8dd4347b4946b1d684e746fbff76';
  keyMaster =
    'Basic a2lkX3J5ZjhOUHF0XzoxMDM4ZTdlZjY1YjM0M2ZkYTdlNmJkMWNhZmUzNjBiNw==';

  keyRegister = 'Basic ' + btoa(this.kinveyAppKey + ':' + this.kinveyAppSecret);
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('/user') && request.method === 'POST') {
      request = request.clone({
        headers: request.headers.set('Authorization', this.keyRegister),
      });
    } else {
      request = request.clone({
        headers: request.headers.set('Authorization', this.keyMaster),
      });
    }

    return next.handle(request);
  }
}

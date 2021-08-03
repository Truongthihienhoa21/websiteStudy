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
  kinveyAppKey = 'kid_By_1hT8kY';
  kinveyAppSecret = 'dd171880e8fd4bf495067534b7883bbe';
  keyMaster =
    'Basic a2lkX0J5XzFoVDhrWTpiMTdhNTdlODdjNzY0MDZhYTJkM2JiYjI1NzkyY2Y2Mw==';

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

import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpEvent,HttpInterceptor,HttpHandler,  HttpRequest,} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()

export class HttpsRequestInterceptor implements HttpInterceptor {


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const dupReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + "BQADnZqcdCxBi9Vk1t8G5g5Vy6Rx1VLP_1srTCm5etFHkQNkeAVv4DyuSnuJe_VnMyKVilwM5XSujvLp_BZVYwDTTCS9n0GT8-iTfO_OhwGWn-zMhn5E8XvSVxdnEWLZWoM28J9Iz7XgWQ"),
    });
    return next.handle(dupReq);
  }
}


@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true,
    },
  ],
})
export class Interceptor {}


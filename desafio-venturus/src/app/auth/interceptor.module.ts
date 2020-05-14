import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Injectable()

export class HttpsRequestInterceptor implements HttpInterceptor {

constructor(private route: ActivatedRoute){
  }

  intercept(req: HttpRequest<any>, next: HttpHandler, ): Observable<HttpEvent<any>> {
    const dupReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + "BQAUHSR6Tw1RKfAJvmUZeabHofngy9_HLJxDWg3zXHR0dvdf-qcIOtNlxe3U-vohNHVj61GcFv8PKAiodFkJm0dPoEj0fqtgAIslICjXxuOZkxURhJvmNd0Bqh7WQkbr8ii0NvSy_U1Csg"),
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
export class Interceptor { }


import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Injectable()

export class HttpsRequestInterceptor implements HttpInterceptor {



constructor(private route: ActivatedRoute){
  // this.route.paramMap.subscribe((params: ParamMap) => {
  //   let code = params.get("code");
  //   console.log("code")
  //   console.log(code)
  // });
}

  intercept(req: HttpRequest<any>, next: HttpHandler, ): Observable<HttpEvent<any>> {
    const dupReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + "BQCVAeKcFPhAQGvBfiI_A29EvGLHlrs1_uwKc0gTHwpPpBuAtlNoWJ64abZcdLlRVu6-vZbqApcwKvoWL-yE8XOZQCpBnrMEd9K-tBTkO7ln0f8BEW7PWaIWcuCREKIVpd_NNJ8SWQ1Qzw"),
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


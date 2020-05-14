import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Injectable()

export class HttpsRequestInterceptor implements HttpInterceptor {

  constructor(private route: ActivatedRoute) {
  }

  //// interceptor para utilixar o token de autenticação em cada chamada as APIs do spotify

  /*Para gerar o token cole o seguinte comando no navegador
  - https://accounts.spotify.com/authorize?client_id=8d51c17835754ad9b571b3d3ece0ff70&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F
  - na barra de endereço copiar o valor do parametro  "code"
  - em seguida rodar este comando no CMD
    curl -H "Authorization: Basic OGQ1MWMxNzgzNTc1NGFkOWI1NzFiM2QzZWNlMGZmNzA6MDljNzc5Mzg2Y2JiNGZkOThkNjFmNmIzOTJhNzg5OTU=" -d grant_type=authorization_code -d code= **CODIGO** -d redirect_uri=http%3A%2F%2Flocalhost%3A4200%2F https://accounts.spotify.com/api/token --ssl-no-revoke
    aonde **CODIGO** é o calor do parametro "code" no navegador
  - apos rodar o comando no CMD, pegar o valor da propriedade access_token e inserir após o "Bearer" abaixo
  */

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


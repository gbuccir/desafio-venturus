import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) {

    // document.onscroll = function () {
    //   if (document.documentElement.scrollTop + window.innerHeight + 20 >= document.documentElement.scrollHeight) {

    //   }
    // }
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (document.documentElement.scrollTop + window.innerHeight + 10 >= document.documentElement.scrollHeight) {

      this.listarProximo()
    }
  }

  public userImg = null;
  public temImagem = false;
  public resultado = null;
  public pesquisa: string = "";
  private timer;
  public albumSelecionado = false;
  public itemSelecionado = null;
  public searching = false;
  private urlPagina: string;

  ngOnInit() {
    let topDez = JSON.parse(localStorage.getItem("topDez"));
    //console.log(topDez)
    this.resultado = []
    this.resultado = topDez;
    this.getUsuario();
  }

  listar() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.searching = true;
      this.http.get("https://api.spotify.com/v1/search", {
        params: {
          q: this.pesquisa,
          type: ["album", "track"]
        }
      })
        .subscribe(data => {
          this.resultado = data;
          if (this.resultado.albums.next != null)
            this.urlPagina = this.resultado.albums.next
          this.resultado = this.resultado.albums.items
          this.searching = false;
          console.log(data)
        },
          err => {
            this.verificaErro(err)
            this.searching = false;
          })
    }, 1000);
  }


  selecionarItem(item) {
    let arrayItens = [];
    let topStorage = JSON.parse(localStorage.getItem("topDez"));
    topStorage == null ? arrayItens = [] : arrayItens = topStorage;

    let itemIncluso = arrayItens.find(n => n.id == item.id)
    if (!itemIncluso) {
      if (arrayItens.length == 10)
        arrayItens.shift();
      arrayItens.push(item);
      localStorage.setItem("topDez", JSON.stringify(arrayItens));
    }
    localStorage.setItem("itemSelecionado", JSON.stringify(item.id));

    this.albumSelecionado = true
    this.listarFaixas(item.id)
  }


  ///album selecionado

  listarFaixas(idSelected) {
    this.searching = true;
    this.http.get("https://api.spotify.com/v1/albums/" + idSelected)
      .subscribe(data => {
        this.itemSelecionado = data
        // console.log(data);
        this.searching = false;
      },
        err => {
          this.verificaErro(err)
          this.searching = false;
        })

  }

  converterDuracao(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
  }

  voltar() {
    this.albumSelecionado = false;
  }



  getUsuario() {
    this.searching = true;
    this.http.get("https://api.spotify.com/v1/me")
      .subscribe(data => {
        let imgUser = data
        this.userImg = imgUser;
        if (this.userImg.images.length <= 0) {
          this.userImg.images[0] = {};
          this.userImg.images[0].url = "../../assets/images/venturus.jpg";
        }
        this.temImagem = true
        this.searching = false;
      },
        err => {
          this.verificaErro(err)
          this.searching = false;
        })
  }


  private resultadoAux;
  listarProximo() {
    if (this.urlPagina != null) {

      this.http.get(this.urlPagina)
        .subscribe(data => {
          this.resultadoAux = data;
          this.resultadoAux = this.resultadoAux.albums.items
          this.resultado = [...this.resultado, ...this.resultadoAux]
          this.searching = false;
          console.log(data)
          if (this.resultado.next != null)
            this.urlPagina = this.resultado.next
            else
            this.urlPagina = null
        },
          err => {
            this.verificaErro(err)
            this.searching = false;
          })
    }
  }


  verificaErro(err) {
    if (err.error.error.message == "The access token expired")
      alert("Token expirado, tente novamente")
  }

}

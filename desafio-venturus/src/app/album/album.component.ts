import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  public userImg = null;
  public temImagem = false;
  public artist;
  public itemSelecionado = null
  private idSelecionado
  public albumSelecionado = false
  public resultado = null;
  public searching = false;
  private urlPagina: string;
  private resultadoAux;


  @HostListener('window:scroll', ['$event']) // Scroll infinito, quando chega no fim chama nova lista
  onScroll(event) {
    if (document.documentElement.scrollTop + window.innerHeight + 10 >= document.documentElement.scrollHeight) {
      this.listarProximo()
    }
  }


  // pega na url o valor do artista desejado, chama a listagem de albums e de informacções do usuario
  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let artist = params.get("artist");
      this.artist = artist;
      console.log(this.artist)
      this.listar()
    });
    this.getUsuario();
  }

  // lista os album a partir do artista passado na url
  listar() {
    this.http.get("https://api.spotify.com/v1/search", {
      params: {
        q: this.artist,
        type: ["album", "track"]
      }
    })
      .subscribe(data => {
        this.resultado = data;
        if (this.resultado.albums.next != null)
          this.urlPagina = this.resultado.albums.next
        this.resultado = this.resultado.albums.items
        this.searching = false
      },
        err => {
          this.verificaErro(err)
        })
  }

  // lista faixas do album selecionado
  listarFaixas(idSelected) {
    this.http.get("https://api.spotify.com/v1/albums/" + idSelected)
      .subscribe(data => {
        this.itemSelecionado = data
        console.log(data);
      },
        err => {
          this.verificaErro(err)
        })

  }

  // Conversor de milissegundos para minutos: segundos usado para saber a duracao de cada faixa
  converterDuracao(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
  }


  // Marca um album como selecionado e o guarda no storage do browser para os ultimos 10 visitados
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


  // Recupera as informacoes do usuario
  getUsuario() {
    this.http.get("https://api.spotify.com/v1/me")
      .subscribe(data => {
        let imgUser = data
        this.userImg = imgUser;
        if (this.userImg.images.length <= 0) {
          this.userImg.images[0] = {};
          this.userImg.images[0].url = "../../assets/images/venturus.jpg";
        }
        this.temImagem = true
      },
        err => {
          this.verificaErro(err)
        })
  }


  ///lista os poroximos resultados no scroll
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


  // Volta para a selecao de albums do artista
  voltar() {
    this.albumSelecionado = false;
  }

  // funcao de erro padrao para saber se o token ta ativo
  verificaErro(err) {
    if (err.error.error.message == "The access token expired")
      alert("Token expirado, tente novamente")
  }



}

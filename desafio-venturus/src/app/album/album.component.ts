import { Component, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let artist = params.get("artist");
      this.artist = artist;
      console.log(this.artist)
      this.listar()
    });
    this.getUsuario();
  }


  listar() {
    //this.http.get("https://api.spotify.com/v1/artists/" + this.idSelecionado + "/albums")
    this.http.get("https://api.spotify.com/v1/search", {
      params: {
        q: this.artist,
        type: ["album", "track"]
      }
    })
      .subscribe(data => {
        this.resultado = data;
        console.log(this.resultado.albums.items)
        this.resultado = this.resultado.albums.items
      },
        err => {
          this.verificaErro(err)
        })
  }

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

  converterDuracao(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
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

    //this.router.navigate(['/albums']);
    this.albumSelecionado = true
    this.listarFaixas(item.id)
  }


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


  voltar() {
    this.albumSelecionado = false;
  }

  verificaErro(err) {
    if (err.error.error.message == "The access token expired")
      alert("Token expirado, tente novamente")
  }


}

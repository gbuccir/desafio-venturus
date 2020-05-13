import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {


  constructor(private route: ActivatedRoute, private router: Router, private http:HttpClient) { }

  public artist;
  public itemSelecionado = null
  private idSelecionado

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let artist = params.get("artist");
      this.artist = artist;
      console.log(this.artist)
    });

    if (!this.artist) {
      this.idSelecionado = JSON.parse(localStorage.getItem("itemSelecionado"));
    }

    this.listarFaixas()
  }

  listarFaixas() {
    this.http.get("https://api.spotify.com/v1/albums/" + this.idSelecionado)
      .subscribe(data => {
        this.itemSelecionado = data
        console.log(data);
      },
        err => {
          console.log(err);
        })

  }

   converterDuracao(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
  }


}

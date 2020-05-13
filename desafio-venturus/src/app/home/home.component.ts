import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // private token = "BQCDtDTZUTL-_uQFerzLPVa8r0AanmydeQiUR3jqthO2JKeZ3yMHMlO8TK3tVabVfUClAeO2blPC3N334YPYFb6gYtvoO04RC1QZi5D9mo6RA6gFBen5MrY4xc0DydR9bZ5v6tWTtAptuw"

  constructor(private router: Router, private http: HttpClient) {

  }

  public resultado = null;
  public pesquisa: string = "";
  private timer;

  ngOnInit() {
    let topDez = JSON.parse(localStorage.getItem("topDez"));
    console.log(topDez)
    this.resultado = []
    this.resultado = topDez;
  }

  // https://api.spotify.com/v1/albums

  listar() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.http.get("https://api.spotify.com/v1/search", {
        params: {
          q: this.pesquisa,
          type: ["album", "track"]
        }
      })
        .subscribe(data => {
          this.resultado = data;
          console.log(this.resultado.albums.items)
          this.resultado = this.resultado.albums.items
        },
          err => {
            console.log(err);
          })
    }, 1000);
  }


  selecionarItem(item) {
    let arrayItens = [];
    let topStorage = JSON.parse(localStorage.getItem("topDez"));
    topStorage == null ? arrayItens = [] : arrayItens = topStorage;

    let itemIncluso = arrayItens.find(n => n.id == item.id)


    //if (!arrayItens.includes(item.id)) {
    if (!itemIncluso) {
      if (arrayItens.length == 10)
        arrayItens.shift();
      arrayItens.push(item);
      localStorage.setItem("topDez", JSON.stringify(arrayItens));
    }
    localStorage.setItem("itemSelecionado", JSON.stringify(item.id));

    this.router.navigate(['/albums']);
  }

}

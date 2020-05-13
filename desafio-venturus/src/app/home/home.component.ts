import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  // private token = "BQCDtDTZUTL-_uQFerzLPVa8r0AanmydeQiUR3jqthO2JKeZ3yMHMlO8TK3tVabVfUClAeO2blPC3N334YPYFb6gYtvoO04RC1QZi5D9mo6RA6gFBen5MrY4xc0DydR9bZ5v6tWTtAptuw"

  constructor(private router: Router, private http: HttpClient) {

  }

  public albums;
  public pesquisa;

  ngOnInit() {
  }

  // https://api.spotify.com/v1/albums
  listarAlbums() {
    this.http.get("https://api.spotify.com/v1/search", {
      params: {
        q: this.pesquisa,
        type: "album"
      }
    })
      .subscribe(data => {
        this.albums = data;
      },
        err => {
          console.log(err);
        })
  }


}

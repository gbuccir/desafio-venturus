import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.sass']
})
export class AlbumComponent implements OnInit {


  constructor(private route:ActivatedRoute, private router:Router) { }

  artist;

  ngOnInit() {
    this.route.paramMap.subscribe((params:ParamMap) => {
        let artist = params.get("artist");
        this.artist = artist;
        console.log(this.artist)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-manage-songs',
  templateUrl: './manage-songs.component.html',
  styleUrls: ['./manage-songs.component.css']
})
export class ManageSongsComponent implements OnInit {
  catagories
  playlists
  searchText;
  songs;
  // heroes = [
  //   { id: 11, name: 'Mr. Nice', country: 'India' },
  //   { id: 12, name: 'Narco' , country: 'USA'},
  //   { id: 13, name: 'Bombasto' , country: 'UK'},
  //   { id: 14, name: 'Celeritas' , country: 'Canada' },
  //   { id: 15, name: 'Magneta' , country: 'Russia'},
  //   { id: 16, name: 'RubberMan' , country: 'China'},
  //   { id: 17, name: 'Dynama' , country: 'Germany'},
  //   { id: 18, name: 'Dr IQ' , country: 'Hong Kong'},
  //   { id: 19, name: 'Magma' , country: 'South Africa'},
  //   { id: 20, name: 'Tornado' , country: 'Sri Lanka'}
  // ];
  constructor(public http:Http,public router:Router,public cookie:CookieService) { }

  ngOnInit() {
    if(!(this.cookie.check("Adminuname") && this.cookie.check("Adminuid")))
      this.router.navigate([''])
    else{
      this.http.get("http://localhost:8080/loadPlaylists").subscribe((data) => this.loadPlaylist(data));
      this.http.get("http://localhost:8080/loadCata").subscribe((data) => this.loadCatag(data));
      this.http.get("http://localhost:8080/loadSongs").subscribe((data) => this.loadSongs(data));
    }
  }

  loadSongs(data)
  {
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    this.songs=arr;
  }
  loadPlaylist(data)
  {
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    this.playlists=arr;
  }
  loadCatag(data)
  {
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    this.catagories=arr;
  }
}

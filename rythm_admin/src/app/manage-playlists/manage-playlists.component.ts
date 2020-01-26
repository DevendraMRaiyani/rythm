import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-manage-playlists',
  templateUrl: './manage-playlists.component.html',
  styleUrls: ['./manage-playlists.component.css']
})
export class ManagePlaylistsComponent implements OnInit {
  playlists
  rename
  constructor(public http:Http,public router:Router,public cookie:CookieService) { }
  ngOnInit() {
    if(!(this.cookie.check("Adminuname") && this.cookie.check("Adminuid")))
      this.router.navigate([''])
    else
      this.http.get("http://localhost:8080/loadPlaylists").subscribe((data) => this.loadPlaylist(data));
  
  }
  loadPlaylist(data)
  {
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    this.playlists=arr;
  }
  selectChangeHandler (event: any) {
    var t=event.target.value;
    if(t!="-select-")
      this.rename=t;
    else
      this.rename="";
  }
  
  removePlaylist(){
    if(this.rename==undefined)
      console.log('select playlist');
    else
      this.http.get("http://localhost:8080/removePlaylist?name="+this.rename).subscribe((data) => this.removedSong(data));
  }
  removedSong(data){
    var y = Array.of(data._body);
    var arr=JSON.parse(<any>y);
    if(arr.n==1){
      alert("Playlist is removed Successfully!!!");
      location.reload();
    }
  
  }
}

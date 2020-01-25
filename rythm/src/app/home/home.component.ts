import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as $ from 'jquery';
import { CookieService } from 'ngx-cookie-service';
//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  playlists
  constructor(public http:Http,public cookie:CookieService) { }
 
  isLogin=true;
  user
  ngOnInit() {
    if(this.cookie.check("uid")){
      this.isLogin=false;
      this.user=this.cookie.get("uname");
    }
    this.http.get("http://localhost:3000/loadplaylist").subscribe((data) => this.displayData(data));
    
    $(document).ready(function(){
     
      $("#search").mouseover(function(){
      $('#search').addClass('shadow');
      });
      $("#search").mouseout(function(){
      $('#search').removeClass('shadow');
      });
      $("#login").mouseover(function(){
      $('#login').addClass('shadow');
      });
      $("#login").mouseout(function(){
      $('#login').removeClass('shadow');
      });
      });
        
  }
  displayData(data){
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);    
    this.playlists=arr;
  }
  searchSong(value:string){
    this.http.get("http://localhost:3000/searchsong?ssong="+value).subscribe((data) => this.songList(data));
    console.log(value);
  }
  songList(data){

  }
  logOut(){
    this.cookie.delete("uname");
    this.cookie.delete("uid");
    this.isLogin=true;
  }
}

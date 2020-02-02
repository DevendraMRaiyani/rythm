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
  sucnewcate
  imgurl:String= null;
  fileToUpload:File=null;
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

  handleFileInput(file:FileList){
    this.fileToUpload = file.item(0)
    var reader = new FileReader()
    reader.onload = (event: any) => {
      this.imgurl = event.target.result;
      console.log(this.imgurl)
    }
    reader.readAsDataURL(this.fileToUpload);

  }
  addPlaylist(event)
  {
    event.preventDefault()
    const target = event.target;
    const cname = target.querySelector('#plname').value;
    this.http.get("http://localhost:8080/checkPlaylist?cname="+cname).subscribe((data) => this.checkPlaylist(data,cname));
  }
  checkPlaylist(data,cname)
  {
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    if(arr.length==0)
      this.http.get("http://localhost:8080/addPlaylist?cname="+cname).subscribe((data) => this.displayData(data));
    else
      this.sucnewcate="Catagory of '"+cname+"' exists!!! Please, try with differnt name"
      //alert("Catagory of '"+cname+"' exists!!! Please, try with differnt name");
  }
  displayData(data){
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    if(arr.length==0)
      alert("Some Problem Occured!! Please Try Leter!!!");
    else{
      alert("Successfully added new Playlist");
      location.reload();
    }
      
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

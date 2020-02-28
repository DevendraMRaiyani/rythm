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
  selectedsongs=[]
  selectedpl
  selectedIds=[]
  plSongsId=[]
  plSongs=[]
  succate
  songs
  imgurl:String= null;
  fileToUpload:File=null;
  constructor(public http:Http,public router:Router,public cookie:CookieService) { }
  ngOnInit() {
    if(!(this.cookie.check("Adminuname") && this.cookie.check("Adminuid")))
      this.router.navigate([''])
    else
    {
      this.http.get("http://localhost:8080/loadPlaylists").subscribe((data) => this.loadPlaylist(data));
      this.http.get("http://localhost:8080/loadSongs").subscribe((data) => this.loadSongs(data));
    }
  }
  loadPlaylist(data)
  {
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    this.playlists=arr;
    //console.log(arr);
  }
  loadSongs(data)
  {
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    this.songs=arr;
    //console.log(arr);
  }
  AddSongUP(value)
  {
    var f=0;
    for(var i of this.plSongs)
    {
      if(i==value)
      {  
        f=0;
        break;
      }
      else
        f=1;
    }
    if(f==1){
      f=1;
      this.plSongs.unshift(value);
    }
  }
  RemoveSongUP(value)
  {
    const index = this.plSongs.indexOf(value, 0);
    if (index > -1) {
      this.plSongs.splice(index, 1);
    }
  }
  AddSong(value)
  {
    var f=0;
    if(this.selectedsongs.length==0)
    {
      f=1;
    }
    for(var i of this.selectedsongs)
    {
      if(i==value)
      {  
        f=0;
        break;
      }
      else
        f=1;
    }
    if(f==1){
      f=1;
      this.selectedsongs.unshift(value);
    }
    //console.log(this.selectedsongs);
  }
  RemoveSong(value)
  {
    const index = this.selectedsongs.indexOf(value, 0);
    if (index > -1) {
      this.selectedsongs.splice(index, 1);
    }
  }
  selectChangeHandler (event: any) {
    this.plSongsId=[]
    this.plSongs=[]
    var t=event.target.value;
    if(t!="-select-")
    {
      this.rename=t;
      this.selectedpl=t;
      for(var i of this.playlists)
      {
        if(i.name==t)
        {
            this.plSongsId=i.songs
        }
      }
    }
    else
      this.rename="";
    
    //console.log("Ids: "+this.plSongsId)
    
    for(var i of this.plSongsId)
    {
      for(var j of this.songs)
      {
        if(i==j._id)
        {
          this.plSongs.push(j.name)
        }
      }
    }
    //console.log("Songs: "+this.plSongs)
  }
 
  updatePlaylist(event)
  {
    event.preventDefault()
    const target = event.target;
    const cname = target.querySelector('#rename').value.trim();

    this.plSongsId=[]
    for(var i of this.plSongs)
    {
        for(var j of this.songs)
        {
          if(j.name==i)
            this.plSongsId.push(j._id)
        }
    }

    if(cname!=this.selectedpl)
      this.http.get("http://localhost:8080/checkPlaylist?cname="+cname).subscribe((data) => this.checkPlaylistUP(data,cname));
    else
    {
      const obj={
        name:cname,
        songs:this.plSongsId
      }
      const mainobj={
        plobj:obj,
        oldnm:this.rename
      }
      this.http.post(`http://localhost:8080/updatePlaylist`,mainobj).subscribe((data) => this.displayDataUP(data));
    }

  }
  checkPlaylistUP(data,cname)
  {
    //console.log("Updating: "+this.plSongsId);
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    const obj={
      name:cname,
      songs:this.plSongsId
    }
    const mainobj={
      plobj:obj,
      oldnm:this.rename
    }
    if(arr.length==0)
      this.http.post(`http://localhost:8080/updatePlaylist`,mainobj).subscribe((data) => this.displayDataUP(data));
      //this.http.get("http://localhost:8080/addPlaylist?cname="+cname).subscribe((data) => this.displayData(data));
    else
      this.succate="Playlist '"+cname+"' exists!!! Please, try with differnt name"
      //alert("Catagory of '"+cname+"' exists!!! Please, try with differnt name");
  }
  handleFileInput(file:FileList){
    this.fileToUpload = file.item(0)
    var reader = new FileReader()
    reader.onload = (event: any) => {
      this.imgurl = event.target.result;
      //console.log(this.imgurl)
    }
    reader.readAsDataURL(this.fileToUpload);

  }
  addPlaylist(event)
  {
    event.preventDefault()
    const target = event.target;
    const cname = target.querySelector('#plname').value.trim();
    this.http.get("http://localhost:8080/checkPlaylist?cname="+cname).subscribe((data) => this.checkPlaylist(data,cname));
  }
  checkPlaylist(data,cname)
  {
    for(var i of this.selectedsongs)
    {
        for(var j of this.songs)
        {
          if(j.name==i)
            this.selectedIds.push(j._id)
        }
    }
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    const obj={
      name:cname,
      songs:this.selectedIds
    }
    if(arr.length==0)
      this.http.post(`http://localhost:8080/addPlaylist`,obj).subscribe((data) => this.displayData(data));
      //this.http.get("http://localhost:8080/addPlaylist?cname="+cname).subscribe((data) => this.displayData(data));
    else
      this.succate="Playlist '"+cname+"' exists!!! Please, try with differnt name"
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
  displayDataUP(data){
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    if(arr.length==0)
      alert("Some Problem Occured!! Please Try Leter!!!");
    else{
      alert("Successfully updated Playlist");
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

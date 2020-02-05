import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
const UploadURL = 'http://localhost:8080/api/upload';
@Component({
  selector: 'app-manage-songs',
  templateUrl: './manage-songs.component.html',
  styleUrls: ['./manage-songs.component.css']
})
export class ManageSongsComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({url: UploadURL, itemAlias: 'Song'});
  catagories
  playlists
  searchText;
  imgurl:String= null;
  fileToUpload:File=null;
  songs;
  rename=""
  filestatus:number;
  public isCollapsed = true;
  audioname:String;
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
  constructor(private http:Http,private router:Router,private cookie:CookieService) { }

  ngOnInit() {
    if(!(this.cookie.check("Adminuname") && this.cookie.check("Adminuid")))
      this.router.navigate([''])
    else{
      this.http.get("http://localhost:8080/loadPlaylists").subscribe((data) => this.loadPlaylist(data));
      this.http.get("http://localhost:8080/loadCata").subscribe((data) => this.loadCatag(data));
      this.http.get("http://localhost:8080/loadSongs").subscribe((data) => this.loadSongs(data));
    }
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
  this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
       console.log('FileUpload:uploaded:', item, status, response);
       this.filestatus=status;
       console.log("file status",this.filestatus)
      // alert('File uploaded successfully');
       //this.router.navigate[''];
   };
  }


  
   

  // handleFileInput(file:FileList){
  //   this.fileToUpload = file.item(0)
  //   var reader = new FileReader()
  //   reader.onload = (event: any) => {
  //     this.imgurl = event.target.result;
  //     console.log(this.imgurl)
  //   }
  //   reader.readAsDataURL(this.fileToUpload);

  // }
  onFileChange(event){
    const file = (event.target as HTMLInputElement).files[0];
    this.audioname=file.name;
    // this.uploadForm.patchValue({
    //   photo: file
    // });
    // this.uploadForm.get('photo').updateValueAndValidity();
    // console.log(this.uploadForm.get('photo'))
  }
  addSong()
  {
    console.log("asdsadjkshdjhsdjhsahdjhsajdhjs")
    //event.preventDefault()
    //const target = event.target;
    //const cname = target.querySelector('#sname').value;
    /*const obj = {
      name : target.querySelector('#sname').value,
      photo : this.imgurl
    }*/
    // const obj = {
    //   name : target.querySelector('#sname').value,
    //   filmname :target.querySelector('#fname').value,
    //   catagory:this.rename,
    //   releasedate:target.querySelector('#redate').value,
    //   artists:target.querySelector('#artist').value
    // } 
    const fobj={
      name:this.audioname
    }
    //this.http.post(`http://localhost:8080/song/add`,obj).subscribe(res => alert("Successfully Added new song!!!"));
    //this.http.post(`http://localhost:8080/song/add`,fobj).subscribe(res => res);
    this.http.post("http://localhost:8000/song/addaudio",fobj).pipe(map(res => res));
    console.log("file status",this.filestatus);
  }

  
  selectChangeHandler (event: any) {
    var t=event.target.value;
    if(t!="-select-")
      this.rename=t;
    else
      this.rename="";
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

  removeSong(value)
  {
    this.http.get("http://localhost:8080/removeSong?sname="+value).subscribe((data) => alert("Successfully removed song '"+value+"'"));
  }

  playSong(value)
  {
      console.log("Play==== "+value);
  }

  editSong(value)
  {
      console.log("Edit==== "+value);
  }
}

import { Component, OnInit,Input } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {  FileUploader} from 'ng2-file-upload';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
const UploadURL = 'http://localhost:8080/api/upload';


@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Songs Details</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <table>
        <tr>
          <td>Song Name</td>
          <td><input type="text" class="form-control" value="{{name}}"/></td>
        </tr>
        <tr>
          <td>Film Name</td>
          <td><input type="text" class="form-control" value="{{filmname}}"/></td>
        </tr>
        <tr>
          <td>Release Date</td>
          <td><input  type="text" class="form-control" value="{{releasedate}}"/></td>
        </tr>
        <tr>
          <td>Artist Name</td>
          <td><input  type="text" class="form-control" value="{{artist}}"/></td>
        </tr>
      </table> 
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close('Close click')">Update Changes</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;
  @Input() filmname;
  @Input() releasedate;
  @Input() artist;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-manage-songs',
  templateUrl: './manage-songs.component.html',
  styleUrls: ['./manage-songs.component.css']
})

export class ManageSongsComponent implements OnInit {

  constructor(private http:Http,private router:Router,private cookie:CookieService,private modalService: NgbModal) { }



  open(value,value1,value2,value3) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = value;
    modalRef.componentInstance.filmname = value1;
    modalRef.componentInstance.releasedate = value2;
    modalRef.componentInstance.artist = value3;
  }

  public uploader: FileUploader = new FileUploader({url: UploadURL, itemAlias: 'Song'});
  catagories
  playlists
  searchText;
  selectedPls=[]
  imgurl:String= null;
  fileToUpload:File=null;
  songs;
  rename=""
  sname
  songId
  filestatus:number;
  public isCollapsed = true;
  audioname:String;
  

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
       //console.log('FileUpload:uploaded:', item, status, response);
       this.filestatus=status;
       //console.log("file status",this.filestatus)
   };
  }
  onFileChange(event){
    const file = (event.target as HTMLInputElement).files[0];
    this.audioname=file.name;
    this.sname=file.name;
    this.sname=this.sname.slice(0,-4);
  }
  selectChangeHandler (event: any) {
    var t=event.target.value;
    if(t!="-select-")
      this.rename=t;
    else
      this.rename="";

  }
  addSong(obj:any)
  {
    //console.log("asdsadjkshdjhsdjhsahdjhsajdhjs")
    obj.name=obj.name.trim();
    obj.filmname=obj.filmname.trim();
    obj.catagory=this.rename;
    obj.link=this.audioname;
    const fobj={
      name:this.audioname
    }
    //console.log(obj.name)
    this.http.post("http://localhost:8080/song/addaudio",fobj).pipe(map(res => res));
    this.http.post(`http://localhost:8080/song/add`,obj).subscribe((data) => this.displayAddSong(data));
    
    
  }
  displayAddSong(data)
  {
    var x;
    x=data;
    var y = Array.of(x._body);
    var arr=JSON.parse(<any>y);
    this.songId=arr[0]._id
    //alert("Successfully added new Song!!!")
    const obj=
    {
      sid:this.songId,
      plarr:this.selectedPls
    }
    this.http.post(`http://localhost:8080/songAddToPls`,obj).subscribe((data) => this.addSongFinal(data));
  }
  addSongFinal(data)
  {
    if(data.ok)
      alert("Successfully added new Song!!!")
      location.reload();
  }
  PlSelec(value)
  {
    this.selectedPls.push(value)
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

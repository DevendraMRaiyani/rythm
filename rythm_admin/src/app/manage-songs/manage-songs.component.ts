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
      <h4 class="modal-title">Songs Details!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Song, {{name}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name;

  constructor(public activeModal: NgbActiveModal) {}
}

@Component({
  selector: 'app-manage-songs',
  templateUrl: './manage-songs.component.html',
  styleUrls: ['./manage-songs.component.css']
})

export class ManageSongsComponent implements OnInit {

  constructor(private http:Http,private router:Router,private cookie:CookieService,private modalService: NgbModal) { }



  open() {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'Name';
  }

  public uploader: FileUploader = new FileUploader({url: UploadURL, itemAlias: 'Song'});
  catagories
  playlists
  searchText;
  imgurl:String= null;
  fileToUpload:File=null;
  songs;
  rename=""
  sname
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
       console.log('FileUpload:uploaded:', item, status, response);
       this.filestatus=status;
       console.log("file status",this.filestatus)
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
    console.log("asdsadjkshdjhsdjhsahdjhsajdhjs")
    obj.catagory=this.rename;
    obj.link=this.audioname;
    const fobj={
      name:this.audioname
    }
    this.http.post("http://localhost:8080/song/addaudio",fobj).pipe(map(res => res));
    this.http.post(`http://localhost:8080/song/add`,obj).subscribe(res => alert("Successfully Added new song!!!"));
    location.reload();
    
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

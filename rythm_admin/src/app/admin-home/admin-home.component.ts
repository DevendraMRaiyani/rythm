import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(public router:Router,public cookie:CookieService) { }

  ngOnInit() {
    if(!(this.cookie.check("Adminuname") && this.cookie.check("Adminuid")))
      this.router.navigate([''])
  }

}

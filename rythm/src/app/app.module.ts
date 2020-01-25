import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotComponent } from './forgot/forgot.component';
import { HomeComponent } from './home/home.component';
import { HttpModule } from '@angular/http';
import {AuthService} from './auth.service';
import { PlaylistdisplayComponent } from './playlistdisplay/playlistdisplay.component';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import { OtpComponent } from './otp/otp.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { CookieService } from 'ngx-cookie-service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FooterComponent } from './footer/footer.component';
import { MyplaylistComponent } from './myplaylist/myplaylist.component';
const appRoutes: Routes = [
  {
      path      : '',
      component: HomeComponent
  },
  {
      path      : 'login',
      component: LoginComponent
  },
  {
    path      : 'signup',
    component: SignupComponent
  },
  {
    path      : 'forgot',
    component: ForgotComponent
  },
  {
    path      : 'changepass',
    component: ChangepassComponent
  },
  {
    path      : 'myplaylist',
    component: MyplaylistComponent
  },
  {
    path      : 'otp/:otp',
    component: OtpComponent
  },
  {
    path      : 'playlist/:pname',
    component: PlaylistdisplayComponent
  }];


@NgModule({
  declarations: [
   
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotComponent,
    HomeComponent,
   PlaylistdisplayComponent,
    OtpComponent,
    ChangepassComponent,
    FooterComponent,
    MyplaylistComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    NgxAudioPlayerModule,
    NgbModule,
    AngularFontAwesomeModule
  ],
  providers: [
    AuthService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CookieService } from 'ngx-cookie-service';
import { ManageCatagoriesComponent } from './manage-catagories/manage-catagories.component';
import { HeaderAdminComponent } from './header-admin/header-admin.component';
import { ManagePlaylistsComponent } from './manage-playlists/manage-playlists.component';
import { ManageSongsComponent } from './manage-songs/manage-songs.component';

const appRoutes: Routes = [
  {
    path      : '',
    component: AdminLoginComponent
  },
  {
    path      : 'home',
    component: AdminHomeComponent
  },
  {
    path:'managecatagories',
    component: ManageCatagoriesComponent
  },
  {
    path:'manageplaylists',
    component: ManagePlaylistsComponent
  },
  {
    path:'managesongs',
    component: ManageSongsComponent
  }];


@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    AdminHomeComponent,
    ManageCatagoriesComponent,
    HeaderAdminComponent,
    ManagePlaylistsComponent,
    ManageSongsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    AppRoutingModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/member/register/register.component';
import { ProfileComponent } from './components/member/profile/profile.component';
import { LoginComponent } from './components/member/login/login.component';
import { MemberListComponent } from './components/member/member-list/member-list.component';
import { PagenofoundComponent } from './pagenofound/pagenofound.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TestPaginationComponent } from './components/member/test-pagination/test-pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    MemberListComponent,
    PagenofoundComponent,
    TestPaginationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

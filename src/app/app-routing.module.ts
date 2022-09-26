import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/member/register/register.component';
import { ProfileComponent } from './components/member/profile/profile.component';
import { LoginComponent } from './components/member/login/login.component';
import { MemberListComponent } from './components/member/member-list/member-list.component';
import { PagenofoundComponent } from './pagenofound/pagenofound.component';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'login'},
  {path:'login',component:LoginComponent},
  {path:'login/:email',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'register/:email',component:RegisterComponent},
  {path:'profile/:email',component:ProfileComponent},
  {path:'member-list',component:MemberListComponent},
  { path: '**', component: PagenofoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

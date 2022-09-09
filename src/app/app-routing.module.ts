import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/member/register/register.component';
import { ProfileComponent } from './components/member/profile/profile.component';
import { LoginComponent } from './components/member/login/login.component';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'login'},
  {path:'login',component:LoginComponent},
  {path:'login/:email',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'register/:email',component:RegisterComponent},
  {path:'profile/:email',component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

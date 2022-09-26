import { JsonPipe } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from './../../../services/crud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFrm!:FormGroup;
  dataFrm!:any;

  constructor(private router:Router,
    private ngZone:NgZone,
    private crudservice:CrudService) { }

  ngOnInit(): void {
  }

  onLogin(loginFrm:any){
    console.log('เข้ามาที่ onLogin แล้ว');
    this.dataFrm = {
      email:loginFrm.email,
      pws:loginFrm.pws
    }
    this.crudservice.Login(this.dataFrm).subscribe({
      next: () => {
      },
      error: (err)=>{
        let reEmail='';
        window.alert('กรุณา Login อีกครั้ง');
        this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reEmail)});
      },
      complete: ()=>{
        let email=this.dataFrm.email;
        window.alert('Login สำเร็จ');
        this.ngZone.run(()=>{this.router.navigateByUrl('/profile/'+email)});
      }
  })
  }
}

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
      next:(res) => {
        console.log('ค่า res ที่ส่งมาจาก crudService-login ='+res);
        if(res !== null){
          let email=this.dataFrm.email;
          console.log('ค่า token ที่จัดเก็บลง Local storage (login.component.ts) = '+localStorage.getItem('token'));
          this.ngZone.run(()=>{this.router.navigateByUrl('/profile/'+email)});
        } else{
          let reEmail='';
          window.alert('กรุณา Login อีกครั้ง');
          this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reEmail)});
        }
      },
      error: (err)=>{
        let reEmail='';
        window.alert('เกิด error กรุณา Login อีกครั้ง');
        this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reEmail)});
      },
      complete: ()=>{}
  })
  }
}

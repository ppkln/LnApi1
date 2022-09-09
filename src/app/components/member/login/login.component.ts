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
    this.crudservice.Login(this.dataFrm).subscribe(null,(err)=>{
      let reid='';
      window.alert('Login ไม่สำเร็จ');
      this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reid)});
    },()=>{
      let reid='';
      window.alert('Login ไม่สำเร็จ');
      this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reid)});
    })
  }
}

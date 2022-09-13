import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable,throwError } from 'rxjs';
import { CrudService } from './../../../services/crud.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registFrm!:FormGroup;
  formData:FormData = new FormData;
  dataFrm!:any;

  constructor(private router:Router,
    private ngZone:NgZone,
    private crudservice:CrudService) { }

  ngOnInit(): void {
  }

  onSubmit(registFrm:any){
    console.log('เข้ามาที่ onSubmit แล้ว');
    if(registFrm.pws === registFrm.cf_pws){
      this.dataFrm = {
        idMem:registFrm.idMem,
        email:registFrm.email,
        pws:registFrm.pws,
        fname:registFrm.fname
      }
      this.crudservice.Register(this.dataFrm).subscribe({
        next: () => {},
        error: (err)=>{
          let reid='';
          window.alert('สมัครสมาชิกไม่สำเร็จ อาจมี e-mail นี้อยู่ในระบบอยู่แล้ว');
          this.ngZone.run(()=>{this.router.navigateByUrl('/register/'+reid)});
        },
        complete: ()=>{
          window.alert('สมัครสมาชิกสำเร็จ (Successfully)');
          this.ngZone.run(()=>{this.router.navigateByUrl('/login')});
        }
    })

      //************ */

    } else{
        window.alert('ข้อความ Password และ Confirm Password ไม่ตรงกัน')
        return this.ngZone.run(()=>{this.router.navigateByUrl('/register')});
    }
  }

}

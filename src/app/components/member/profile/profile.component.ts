import { Component, OnInit, NgZone } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userEmail:any;
  idMemOld:any;
  fnameOld:any;
  jwtService: JwtHelperService = new JwtHelperService();
  GToken:any;

  constructor(private ngZone:NgZone,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private crudService:CrudService) { }

  ngOnInit(): void {
    try{
      this.GToken = localStorage.getItem('token'); // เรียกใช้ token ที่แนบมากับ header ของ browser ได้เลยตรงๆ
      console.log('ค่า token ที่จัดเก็บลง Local storage (profile.component.ts) = '+this.GToken);
      let tokenshowdetail = this.jwtService.decodeToken(this.GToken);
      if(this.GToken !==null){//ถ้าไม่มีค่า token เก็บใน localstorage จะให้เปลี่ยนไปที่หน้าอื่น
        let email1 = this.activatedRoute.snapshot.paramMap.get('email');
        this.crudService.getProfile(email1).subscribe((res)=>{
          if(res !==null){
            console.log('ค่า res.isLoggedIn (ส่งค่าจาก crudservice) = '+res.isLoggedIn);
            if(res.isLoggedIn ===true){
              this.userEmail = res.email;
              this.idMemOld = res.idMem;
              this.fnameOld = res.fname;
            } else {
              console.log('ค่า res.isLoggedIn ที่ส่งมาจาก crudservice-getProfile เป็น false ทำให้ต้องลบ token ใน local Storage');
              localStorage.removeItem('token');
              window.location.replace("/");
            }
          } else {
            console.log('ค่า res ที่ส่งมาจาก crudservice-getProfile เป็น null ทำให้ต้องลบ token ใน local Storage');
            localStorage.removeItem('token');
            let reEmail='';
            this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reEmail)});
          }
        })
      } else {//ถ้าไม่มีค่า token เก็บใน localstorage จะให้เปลี่ยนไปที่หน้า login
        console.log('ไม่มีการเก็บค่า token ใน local Storage');
        let reEmail='';
        this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reEmail)});
      }


      } catch(error){
          localStorage.removeItem('token');
          window.location.replace("/");
      }
  }

  logout(){
    localStorage.removeItem('token');
    window.location.replace("/");
  }

}

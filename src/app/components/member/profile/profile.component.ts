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
      let tokenshowdetail = this.jwtService.decodeToken(this.GToken);// เป็นการถอดรหัส token ที่เก็บใน locaส storage
      console.log('ค่า tokenshowdetail.email (profile.component.ts) = '+tokenshowdetail.email);
      if(this.GToken !==null){//ถ้าไม่มีค่า token เก็บใน localstorage จะให้เปลี่ยนไปที่หน้าอื่น
        let email1 = tokenshowdetail.email //this.activatedRoute.snapshot.paramMap.get('email');
        this.crudService.getProfile(email1).subscribe((res)=>{
          if(res !==null){
            if(res.isLoggedIn ===true){
              this.userEmail = res.email;
              this.idMemOld = res.idMem;
              this.fnameOld = res.fname;
            } else {
              localStorage.removeItem('token');
              window.location.replace("/");
            }
          } else {
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

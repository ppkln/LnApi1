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
      let tokenshowdetail = this.jwtService.decodeToken(this.GToken);
      console.log('ค่า localStorage.getItem(token) ที่ส่งเข้า ngOnInit หน้า Profile.component = '+this.GToken);
      if(this.GToken !==null){//ถ้าไม่มีค่า token เก็บใน localstorage จะให้เปลี่ยนไปที่หน้าอื่น
        let email1 = this.activatedRoute.snapshot.paramMap.get('email');
        console.log('ค่า email ที่ส่งเข้า ngOnInit หน้า Profile.component = '+email1);
        this.crudService.getProfile(email1).subscribe((res)=>{
          if(res !==null){
            console.log('ค่า res ที่ผ่าน crudService.getProfile(email1) = '+JSON.stringify(res));
            console.log('ค่า res.isLoggedIn ที่ผ่าน crudService.getProfile(email1) = '+JSON.stringify(res.isLoggedIn));
            if(res.isLoggedIn ===true){
              this.userEmail = JSON.parse(res.email);
              this.idMemOld = JSON.parse(res.idMem);
              this.fnameOld = JSON.parse(res.fname);
            } else {
              localStorage.removeItem('token');
              window.location.replace("/");
            }
          } else {
              localStorage.removeItem('token');
              window.location.replace("/");
          }
        })
      } else {//ถ้าไม่มีค่า token เก็บใน localstorage จะให้เปลี่ยนไปที่หน้า login
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

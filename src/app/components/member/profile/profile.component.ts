import { Component, OnInit, NgZone } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
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

  constructor(private ngZone:NgZone,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private crudService:CrudService) { }

  ngOnInit(): void {
    try{
      let email1 = this.activatedRoute.snapshot.paramMap.get('email');
    console.log('ค่า email ที่ส่งเข้า ngOnInit หน้า Profile.component = '+email1);
    this.crudService.getProfile(email1).subscribe((res)=>{
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
    })
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

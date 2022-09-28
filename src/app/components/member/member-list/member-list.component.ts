import { Component, OnInit,NgZone } from '@angular/core';
import { Router,ActivatedRoute, ParamMap } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  // ส่วนของตัวแปรไว้รับค่าข้อมูลที่ไปดึงมา
    results:any;// กำหนดตัวแปร เพื่อรับค่า
    dataMemberList:any = [];

    constructor(private ngZone:NgZone,
    private router:Router,private route: ActivatedRoute,
    private activatedRoute:ActivatedRoute,
    private crudService:CrudService,
    private httpClient:HttpClient) { }


  ngOnInit(): void {
    // ดึงข้อมูลจากฐานข้อมูลผ่าน api
    this.crudService.getMemberlist().subscribe({
      next:(res)=>{
        console.log('ค่า res ที่ส่งมาจาก crudService-memberlist ='+JSON.stringify(res));
          this.dataMemberList = res;
      },
      error:(err)=>{
        let reEmail='';
        window.alert('กรุณา Login');
        this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reEmail)});
      },
      complete: ()=>{}
    })
  }



}

import { Injectable,NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject,catchError,map } from 'rxjs';
import { Observable,throwError } from 'rxjs';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  //home page
  Home_Page: string = 'http://localhost:4200';
  // node/Express API
  REST_API:string = 'http://localhost:8000/api';
  jwtService: JwtHelperService = new JwtHelperService(); // สำหรับ decode token เพื่อให้อ่านค่าภายในได้สะดวก
  userProfile = new BehaviorSubject<any | null>(null);
  httpHeaders:any;
  tokenStorage:any;
  tokenDecode:any;

  constructor(private httpClient:HttpClient,
    private ngZone:NgZone,
    private router:Router) {
      // this.tokenStorage = localStorage.getItem('token');
      // console.log('tokenDecode in constructor = '+this.tokenStorage );
     }

  ngOnInit(): void {

  }

  Register(data:any): Observable<any>{
    // this.httpHeaders = new HttpHeaders()
    //       .set('content-type', 'application/json')
    //       .set('authorization', 'bearer '+this.tokendetail);// กำหนดค่า headers ที่แนบไปกับ httpRequest

    console.log('Data.pws (อยู่ใน crud-register) = '+data.pws)
    let API_URL = this.REST_API+'/register';
    return this.httpClient.post(API_URL,data)
    .pipe(map((res:any)=>{
      if(res.status !=='ok'){
        res.status(403).json(res);
      }
    }),
      catchError(this.handleError)
    )

  }

  Login(data:any): Observable<any>{
    // this.httpHeaders = new HttpHeaders()
    //       .set('content-type', 'application/json')
    //       .set('authorization', 'bearer '+this.tokenStorage);// กำหนดค่า headers ที่แนบไปกับ httpRequest

    console.log('Data (อยู่ใน crud-Login) = '+data)
    let API_URL = this.REST_API+'/login';
    return this.httpClient.post(API_URL,data)
    .pipe(map(async (res:any)=>{
      if(res.isLoggedIn === true){
        console.log('ค่า res.email (ส่งมาจาก backend-login) = '+res.email);
        await localStorage.setItem('token',res.token);// จัดเก็บ token ลงใน localstorage ของ browser
        this.tokenDecode = this.jwtService.decodeToken(res.token); // decode token เพื่อให้อ่านค่าภายในได้สะดวก
        console.log('ค่า tokenDecode.email = '+this.tokenDecode.email);
        console.log('ค่า res.email (กำลังอยู่ใน crudservice-login) = '+res.email);
        return res;
      } else {
        return {};
      }
    }),catchError(this.handleError)
    )
  }

getProfile(data:any): Observable<any>{
  this.tokenStorage = localStorage.getItem('token');
  this.httpHeaders = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('authorization', 'bearer '+this.tokenStorage);// กำหนดค่า headers ที่แนบไปกับ httpRequest

          console.log('ค่า token ที่เก็บอยู่ใน storage = '+this.tokenStorage);
          console.log('ค่า parameter data ที่ส่งเข้ามาใน (getProfile(data)) = '+data);
          let API_URL = this.REST_API+'/profile/'+data;
          return this.httpClient.get(API_URL,{headers:this.httpHeaders})
          .pipe(map((res:any)=>{
            console.log('ค่า res ที่ส่งคืนมาจาก backend-profile-email(กำลังอยู่ที่ crud-getProfile) = '+res.email);
            if(res.isLoggedIn ===true){
              return res;
            } else {
              localStorage.removeItem('token');
              return {};
            }

          }),catchError(this.handleError)
          )
}

  //handle Error
  handleError(error:HttpErrorResponse){
    let errorMessage ='';
    if (error.error instanceof ErrorEvent){
      // handleError client's error
      errorMessage='ฟังก์ชัน handleError แจ้งว่าเกิด client error คือรหัส '+error.error.message;
    } else {
      // handleError Server's error
      errorMessage ='ฟังก์ชัน handleError แจ้งว่าเกิด Server Error code คือรหัส '+error.status+'\n ข้อความ error คือ : ' +error.message;
    }
    console.log(errorMessage);
    localStorage.removeItem('token');
    return throwError(errorMessage);
  }

}

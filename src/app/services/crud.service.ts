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
     }

  ngOnInit(): void {

  }

  Register(data:any): Observable<any>{
    console.log('Data.email (อยู่ใน crud-register) = '+data.email)
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
    console.log('Data (อยู่ใน crud-Login) = '+data)
    let API_URL = this.REST_API+'/login';
    return this.httpClient.post(API_URL,data)
    .pipe(map(async (res:any)=>{
      if(res.isLoggedIn === true){
        await localStorage.setItem('token',res.token);// จัดเก็บ token ลงใน localstorage ของ browser
        this.tokenDecode = this.jwtService.decodeToken(res.token); // decode token เพื่อให้อ่านค่าภายในได้สะดวก
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

          let API_URL = this.REST_API+'/profile/'+data;
          return this.httpClient.get(API_URL,{headers:this.httpHeaders})
          .pipe(map((res:any)=>{
            if(res.isLoggedIn ===true){
              return res;
            } else {
              localStorage.removeItem('token');
              window.location.replace("/");
              return {};
            }

          }),catchError(this.handleError)
          )
}

// ขอข้อมูลรายการสมาชิกทั้งหมดของระบบ (member-list)
getMemberlist(): Observable<any>{
  this.tokenStorage = localStorage.getItem('token');
  this.httpHeaders = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('authorization', 'bearer '+this.tokenStorage);// กำหนดค่า headers ที่แนบไปกับ httpRequest

          let API_URL = this.REST_API+'/member-list';
          return this.httpClient.get(API_URL,{headers:this.httpHeaders})
          .pipe(map((res:any)=>{
            if(res.isLoggedIn ===true){
              return res.data;
            } else {
              localStorage.removeItem('token');
              window.location.replace("/");
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

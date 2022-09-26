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
    urlSource:string = "https://jsonplaceholder.typicode.com";
    highlightId!: number; // สำหรับเก็บ id ที่เพิ่งเข้าดู

  // ส่วนจัดการเกี่ยวกับการแบ่งหน้า variable
    iPage:number[] = [];
    iPageStart:number = 1;
    prevPage!: number;
    nextPage!:number;
    activePage!:number;
    totalItem!:number; // สมมติจำนวนรายการทั้งหมดเริ่มต้น
    perPage:number = 10; // จำนวนรายการที่แสดงต่อหน้า
    totalPage!:number;
    maxShowPage!:number;
    useShowPage:number = 5; // จำนวนปุ่มที่จะแสดงในหน้าเพจ (กรณีนี้ระบุให้มี 5 ปุ่ม)
    pointStart:number = 0; // ตำแหน่งรายการข้อมูลตำแหน่งแรกสำหรับหน้าเพจนี้ active อยู่ (activePage)
    pointEnd!:number; // ตำแหน่งรายการข้อมูลตำแหน่งสุดท้ายสำหรับหน้าเพจที่ active อยู่ (activePage)

  constructor(private ngZone:NgZone,
    private router:Router,private route: ActivatedRoute,
    private activatedRoute:ActivatedRoute,
    private crudService:CrudService,
    private httpClient:HttpClient) { }

    // ส่วนจัดการเกี่ยวกับการแบ่งหน้า
  changePage(page:any){
    this.activePage = page;
    this.router.navigate(['/member-list'], {queryParams:{page:page}});
  }
  pagination(){
    if(this.activePage > this.useShowPage){
      if(this.activePage+2 <= this.totalPage){
        this.iPageStart = this.activePage-2;
        this.maxShowPage = this.activePage+2;
      }else{
        if(this.activePage <= this.totalPage){
          this.iPageStart = (this.totalPage+1)-this.useShowPage;
          this.maxShowPage = (this.iPageStart-1)+this.useShowPage;
        }
      }
      this.iPage = [];
      for(let i=this.iPageStart;i<=this.maxShowPage;i++){
        this.iPage.push(i);
      }
    }else{
      this.iPageStart = 1;
      this.iPage = [];
      for(let i=this.iPageStart;i<=this.useShowPage;i++){
        this.iPage.push(i);
      }
    }
  }
  // สินสุดส่วนจัดการเกี่ยวกับการแบ่งหน้า

  ngOnInit(): void {
    // ดึงข้อมูลจากฐานข้อมูลผ่าน api
    this.crudService.getMemberlist().subscribe({
      next:(res)=>{
        // console.log('ค่า res ที่ส่งมาจาก crudservice-getMemberlist ='+JSON.stringify(res));
          this.dataMemberList = res;
      },
      error:(err)=>{
        let reEmail='';
        window.alert('กรุณา Login');
        this.ngZone.run(()=>{this.router.navigateByUrl('/login/'+reEmail)});
      },
      complete: ()=>{}
    })

    // ส่วนการแบ่งหน้า
    if(this.dataMemberList !== null && this.dataMemberList !==''){
      this.activePage = 1;
      this.nextPage = 2;
      this.pointEnd = this.perPage * this.activePage; // ระบุตำแหน่งข้อมูลตัวสุดท้ายที่จะแสดงของหน้า page นี้
      this.totalPage = Math.ceil(this.totalItem/this.perPage); // คำนวณหาจำนวนหน้าเพจของชุดข้อมูลที่ดึงมาจากฐานข้อมูลว่าจะมีทำหมดกี่หน้า (ตามเงื่อนไขที่กำหนดจำนวนแถวข้อมูล (perPage))

      if(this.totalPage > this.useShowPage){
        this.useShowPage = 5; //ถ้าค่าของ totalPage ยังมากกว่าค่าจำนวนปุ่มที่จะแสดงในหน้าเพจ จะกำหนดจำนวนปุ่ม 5 ปุ่ม
      } else { //ถ้าค่าของ totalPage มีค่าน้อยกว่าค่าจำนวนปุ่มที่จะแสดงในหน้าเพจ จะกำหนดจำนวนปุ่ม ใหม่ เป็นค่าตัวเลขที่ totalPage เก็บค่าไว้
        this.useShowPage = this.totalPage;
      }

      for(let i=this.iPageStart;i<=this.useShowPage;i++){
        this.iPage.push(i); // เพิ่มตัวเลขลำดับของหน้าเพจชุดข้อมูลเข้าไปในตัวแปร array iPage (จะนำไปใช้ในการแสดงปุ่มกดเพื่อเลื่อนไปหน้าต่างๆ)
      }
    }

  }



}

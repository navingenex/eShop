import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, concat, of } from 'rxjs';
import { map } from 'rxjs/operators'



@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {
  baseUrl: string = environment.baseUrl;
  public userData: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor(
    private http: HttpClient
  ) { }

  getUsers() {
    return this.http.get(this.baseUrl + 'user').pipe(map(m => m))
  }

  getData() {
    this.getUsers().subscribe((res: any) => {
      this.userData.next(res)
      // console.log(res)
    })
  }

  addUser() {
    const payload = {
      "name": "navin kumar",
      "email": "eessq2wds@g.com",
      "userName": "asdasd",
      "password": "tapjam",
      "role": 'admin'
    }
    this.http.post(this.baseUrl + 'user', payload).subscribe((data: any) => {
      this.userData.next(data)
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiRequestService } from './shared/api-request.service';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  users: any = [];
  constructor(private apiRequest: ApiRequestService) { }
  ngOnInit() {
    let socket = io.connect(environment.chatUrl);
    socket.on("getuser", s => {
      this.users.push(s)
    })


    this.apiRequest.getData();
    this.apiRequest.userData.subscribe((data: any) => {

      this.users = this.users.concat(data)
    });
  }



  add() {
    this.apiRequest.addUser()
  }
} 

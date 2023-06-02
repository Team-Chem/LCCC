import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{


  constructor(public authService: AuthService, private userInfo: User) {}
  
  ngOnInit(): void {}
  // Data from User import is being injected in constructor. Storing results in variable to reference on user dashboard.
  firstName = this.userInfo.firstName;
}

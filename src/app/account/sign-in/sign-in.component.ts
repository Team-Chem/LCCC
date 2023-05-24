import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  // public showSignOutButton: boolean = false;

  constructor(
    public authService: AuthService
  ) { }
  ngOnInit() {
    // this.showSignOutButton = this.authService.isLoggedIn();
  }
}

import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
// import { User } from '../../services/user.model';

// import JustValidate from 'just-validate';
// import { GlobalConfigInterface } from 'just-validate';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  // firstName: string = '';
 
  constructor(public authService: AuthService) { }
  ngOnInit() { }
  

}

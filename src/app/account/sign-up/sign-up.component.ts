import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MatchPasswordValidator } from '../custom-validators';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  // Error message used to display bootstrap.
  errorMessage?: string;

  // matchPasswordValidator(): boolean {
  //   const password = this.signUpGroup.get('password')?.value;
  //   const confirmPassword = this.signUpGroup.get('confirmPass')?.value;
  //   if (password === confirmPassword)
  //     return true;
  //   else {
  //     return false;
  //   }
  // }

  // Variable below is a FormGroup which is a way to apply client side validation to a form. The rules must be met below in order for a new user to successfully sign up.
  signUpGroup = this.formBuilder.group({

    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[A-Z][a-z]+(([',. -][a-z])?[a-z]*)*$/)]),

    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[A-Z][a-z]+(([',. -][a-z])?[a-z]*)*$/)]),

    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),

    confirmPass: new FormControl('', [Validators.required])

  }, { validators: MatchPasswordValidator() });





  // This is an alternate way to create a group and then assign multiple formControls to it for input validation
  // signUpGroup = this.formBuilder.group({
  //   firstName: ['', 
  //     Validators.required,
  //   ],

  //   lastName: ['', 
  //     Validators.required, 
  //   ],

  //   email: ['', 
  //     Validators.required
  //   ],

  //   password: ['', 
  //     Validators.required
  //   ],

  //   confirmPass: ['', 
  //     Validators.required
  //   ],
  // });



  constructor(public authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }


  ngOnInit() {
    // Subscribe to the errormessage to show in the sign-in.html file for bootstrap.
    this.authService.errorMessage$.subscribe(
      message => {
        this.errorMessage = message;
      }
    )

  }

  async onSubmit() {
    // Check if the user is authenticated
    this.router.navigate(['/account']);
  }

}

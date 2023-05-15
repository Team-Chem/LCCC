import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
// import { User } from '../../services/user.model';

// import JustValidate from 'just-validate';
// import { GlobalConfigInterface } from 'just-validate';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  submitted = false;

  onSubmit() {
    this.submitted = true;
  
    for (const controlName in this.signUpGroup.controls) {
      const control = this.signUpGroup.get(controlName);
  
      if (control && control.invalid) {
        console.log(`${controlName} has errors:`);
        console.log(control.errors);
        throw new Error('There was an invalid input!');
      }
    }
  }

  matchPasswordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = this.signUpGroup.get('password')?.value;
      const confirmPass = control.value;
      return password === confirmPass ? null : { 'passwordMismatch': true };
    };
  }

  signUpGroup = this.formBuilder.group({
    firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[A-Z][a-z]+(([',. -][a-z])?[a-z]*)*$/)]),

    lastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[A-Z][a-z]+(([',. -][a-z])?[a-z]*)*$/)]),

    email: new FormControl('', [Validators.required, Validators.email]),

    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),

    confirmPass: new FormControl('', [Validators.required])

  });


  
  

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

 
  constructor(public authService: AuthService, private formBuilder: FormBuilder) { }


  ngOnInit() { 
    
  }
  

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthGuard } from 'src/app/services/guard/auth.guard';
import { user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  // These two variables are for the two way binding in the sign up page.
  userEmail: string = '';
  userPassword: string = '';

  // Error message used to display bootstrap.
  errorMessage?: string;
  successMessage?: string;

  onSubmit() {

  }


  signInGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required]),

    password: new FormControl('', [Validators.required])

  });

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private afs: AngularFirestore, private afAuth: AngularFireAuth, public route: ActivatedRoute) { }

  ngOnInit() {
    this.SignIn();
    // Subscribe to the errormessage to show in the sign-in.html file for bootstrap.
    this.authService.errorMessage$.subscribe(
      message => {
        this.errorMessage = message;
      }
    );
    // Displays a success message on account page when user successfully logs in.
    this.authService.successMessage$.subscribe(
      message => {
        this.successMessage = message;
      }
    );
  }


  showErrorMessage: boolean = false;

  // WIll be used to show error message to show user if password and email is valid
  SignIn() {
    if (this.signInGroup.valid) {
      this.authService.SignIn(this.userEmail, this.userPassword)
        .then((userCredential) => {
          // Handle successful sign-in
        })
        .catch((error) => {
          // Handle sign-in error
          this.showErrorMessage = true;
        });
    } else {
      this.showErrorMessage = true;
    }
  }


  // Create function that grabs the email from the database that the user is trying to sign in with
  checkEmailFromUser() {

  }


  // Create a function that grabs the password from the database  that the user is tring to sign in with
  checkPasswordFromUser() {

  }

  // If these two values are not from the same user then deny entry to page, else grant entry. If email in istance of UID and password is also in instance of UID then return true else false.
  isEmailandPasswordCorrect() {

  }
}

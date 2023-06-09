import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { user } from '@angular/fire/auth';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  // These two variables are for the two way binding in the sign up page.
  userEmail: string = '';
  userPassword: string = '';

  onSubmit() {

  }


  signInGroup = this.formBuilder.group({
    email: new FormControl('', [Validators.required]),

    password: new FormControl('', [Validators.required])

  });

  constructor(public authService: AuthService, private formBuilder: FormBuilder, private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  ngOnInit() {
  }


  // Create function that grabs the emaail from the database that the user is trying to sign in with
  checkEmailFromUser() {

  }


  // Create a function that grabs the password from the database  that the user is tring to sign in with
  checkPasswordFromUser() {

  }

  // If these two values are not from the same user then deny entry to page, else grant entry. If email in istance of UID and password is also in instance of UID then return true else false.
  isEmailandPasswordCorrect() {

  }
}

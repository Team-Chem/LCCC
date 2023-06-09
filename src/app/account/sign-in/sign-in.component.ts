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
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { db } from 'src/environments/firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { user } from '@angular/fire/auth';
import * as firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../services/user.model';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {

  // Storing data of user interface
  userInfo?: AngularFirestoreCollection<User>;

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  accountCreated: firebase.default.firestore.Timestamp | undefined;
  photoURL: string = '';




  constructor(public authService: AuthService, private firestore: AngularFirestore, private afAuth: AngularFireAuth) {

    // Pulling data from collection
    this.userInfo = this.firestore.collection<User>('users');
  };

  ngOnInit(): void {
    // Note -> functions won't be called automatically unless ran from the ngOnInit method
    this.getCurrentUserUID()
  }

  // Get the UID of the current user who is signed in
  userId: string = '';
  getCurrentUserUID(): void {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        console.log('Current user UID:', this.userId);
        this.getUserInfo(this.userId); // Call getUserInfo with the userId
      } else {
        // User is not signed in
        console.log('No user is currently signed in');
      }
    });
  }

  // Use the UID of the currently logged in user and retreive the information about that user from the users collection in Firebase
  getUserInfo(uid: string): void {
    if (uid) {
      this.userInfo?.doc(uid).get().subscribe(doc => {
        if (doc.exists) {
          const user = doc.data() as User;
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.email = user.email;
          this.accountCreated = user.accountCreated
          this.photoURL = user.photoURL;
          console.log(user);
          // Display or process the retrieved user information
        } else {
          console.log('User not found');
        }
      });
    } else {
      console.log('Invalid UID');
    }
  }
}



import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as auth from 'firebase/auth';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat';
import 'firebase/auth';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';

// Password hahsing function
import * as bcrypt from 'bcryptjs';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any;
  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private afs: AngularFirestore, // Inject Firestore service
    private router: Router) {

      // Takes the data from the user and saves it in a localstorage. Parsing over the data string to retrive info about the user
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData)); // Putting data into JSON format from the localstorage where user data is saved
          JSON.parse(localStorage.getItem('user')!); // Retrieve data
        } else {
          localStorage.setItem('user', 'null'); // Set user data to Null if there is none
          JSON.parse(localStorage.getItem('user')!); // Retrieve data
        }
    });
  }
  
//   SignUp(email: string, password: string, firstName: string, lastName: string) {
//     return this.afAuth.createUserWithEmailAndPassword(email, password) // Creating a new user account in Firebase Authentication using the provided email address and password
//     .then((userCredential) => { // Making a promise, user info is stored in userCredential object. Has the user property, which contains uid, email of user
//       const user = userCredential.user;
//       let uid = '';
//       // If information from user is not null then a email will be sent to verify email and the data will be sent to SetUserData method to send data to database.
//       if (user != null) {
//         // Will send verification email to the user
//         this.SendVerificationEmail();
        
//         // Will only set the users data to Firebase if the email is verified
//         user.reload().then(() =>{
//           // Check to see if the email has been verified and set to true
//           if (user.emailVerified) {
//             this.SetUserData(user, email, password, firstName, lastName, );
//             uid = user.uid; // Storing the uid from the user object
      

//             // Save additional for the user to the Firestore
//             // Specifying what information that needs to be sent to the database
//             this.afs.collection('users').doc(uid).set({
//             uid: uid,
//             email: email,
//             password: password,
//             firstName: firstName,
//             lastName: lastName,
//         });
//       console.log(`User with email ${user.email} signed up successfully`);
//       } else {
//         console.log(`Email verification not completed yet for user ${user.email}`);
//       }
//     });
//   }
// })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log(`Failed to sign up user: ${errorCode} - ${errorMessage}`);
//       // Optional: You can display an error message to the user
//     });
  
//   }

SignUp(email: string, password: string, firstName: string, lastName: string) {
  return this.afAuth.createUserWithEmailAndPassword(email, password) // Creating a new user account in Firebase Authentication using the provided email address and password
  .then((userCredential) => { // Making a promise, user info is stored in userCredential object. Has the user property, which contains uid, email of user
    const user = userCredential.user;
    let uid = '';
    // If information from user is not null then a email will be sent to verify email and the data will be sent to SetUserData method to send data to database.
    if (user != null) {
      // Will send verification email to the user
      this.SendVerificationMail()
      
      // Will only set the users data to Firebase if the email is verified
      if (user.emailVerified) {
        // Check to see if the email has been verified and set to true
        
        // Hasing the password
        const saltRounds = 10; // number of times a random data string (known as a salt) is added to a password before it is hashed
        bcrypt.hash(password, saltRounds) // passing in our password and the # of times we want to salt it 
        .then((hashedPassword) => {
        
        this.SetUserData(user, email, hashedPassword, firstName, lastName, false, Date());
          uid = user.uid; // Storing the uid from the user object
    

          // Save additional for the user to the Firestore
          // Specifying what information that needs to be sent to the database
          this.afs.collection('users').doc(uid).set({
          uid: uid,
          email: email,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          emailVerified: false,
          accountCreated: new Date()
          
      });
    console.log(`User with email ${user.email} signed up successfully`);
    })
    .catch((err) => {
      console.error(`Failed to hash password: ${err}`);
    });
  }
}
})

  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(`Failed to sign up user: ${errorCode} - ${errorMessage}`);
    // Optional: You can display an error message to the user
  });

}

  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password) // Asynchronously signs in using an email and password.
    .then((userCredential) => {
      const user = userCredential.user;
      if (user != null) {
      // Add code to re route user to a page once they sign in.

      console.log(`User with email ${user.email} signed in successfully`);
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Failed to sign in user: ${errorCode} - ${errorMessage}`);
      // Optional: You can display an error message to the user
    });
  }

  // TODO: Will need to create a button that allows the user to sign out. Can add this button on the navbar.
  async SignOut() {
    try {
      await this.afAuth.signOut();
      console.log('User signed out.');
    } catch (error) {
      console.error(error);
    }
  }


// When the user makes an account a verification email will be sent to them to verify.
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((user: any) => {
        if (user != null) {
          return user.sendEmailVerification().then(() => {
            const userRef = this.afs.collection('users').doc(user.uid);
            
            // Listen for changes to the user's authentication state
            this.afAuth.onAuthStateChanged((user: any) => {
              if (user && user.emailVerified) {
                // Update emailVerified field in the database to true
                userRef.set({ emailVerified: true }, { merge: true }).then(() => {
                  this.router.navigate(['/verify_email']);
                });
              }
            });
          });
        }
      });
  } 
  
// Allow the user to be able to reset their password
async PasswordReset(email: string) {
  try {
    await this.afAuth.sendPasswordResetEmail(email)
    console.log('Password reset email sent, check your inbox.');
  } catch (error) {
    console.error(error);
  }
}

// This will allows the user to sign in with different accounts like google, facebook, or github through a pop up. Only Google sign in is implemented so far.
AuthLogin(provider: any) {
  return this.afAuth
    .signInWithPopup(provider)
    .then((result) => {
      console.log('You have been successfully logged in!');
    })
    .catch((error) => {
      console.log(error);
    });
}

// Allow the user to login with their google account
GoogleAuth() {
  return this.AuthLogin(new GoogleAuthProvider());
}

// Keeps track of the user when they login
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }




// Will need to add this function to sendverificationemail to check if the link has been clicked on before it is set to true
/* clickedOnVerificationLink() {

} */
  
  // Send data to firebase
  SetUserData(user: firebase.default.User, firstName: string, lastName: string, email: string, hashedPassword: string, emailVerified: boolean, accountCreated: string) {
    const userRef = this.afs.collection('users').doc(user.uid);
    const userData = {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      uid: user.uid,
      emailVerified: emailVerified,
      accountCreated: accountCreated
    };
    return userRef.set(userData, { merge: true });
  }
  }


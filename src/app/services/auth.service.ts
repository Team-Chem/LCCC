import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

// Password hashing function
import * as bcrypt from 'bcryptjs';
import { Subscription, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // public loggedIn = false;

  // Store entire user authenticated an object from firebase
  userData: any;

  // Components to access just the UID without needing the entire user object
  private userIdSubject = new BehaviorSubject<string | null>(null);
  // "$" means this variable is an observable/accessible to other components.
  public userId$ = this.userIdSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private afs: AngularFirestore, // Inject Firestore service
    private router: Router
  ) {


    // Initialize userData variable
    this.userData = null;
    // Subscribe to the authState to track user authentication state changes
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // User is authenticated
        this.userData = user;
        // Update the userIdSubject with the authenticated user's UID
        this.userIdSubject.next(user.uid);

        // Save user data to localStorage as a JSON string
        localStorage.setItem('user', JSON.stringify(this.userData));

        // Retrieve and parse user data from localStorage
        JSON.parse(localStorage.getItem('user')!);

        console.log("Keeping track of user login!");
      } else {

        // TODO: Remove this if merge is successful.
        // this.userIdSubject.next(null); // Reset the userIdSubject if no user is authenticated
        // // User is not authenticated
        // localStorage.setItem('user', 'null'); // Set user data to Null if there is none
        this.userData = null;

        localStorage.removeItem('user');  // Remove 'user' item from localStorage.
      }
    });
  }

  // Used in Route Guard to check data for the user is still in localstorage
  isUserAuthenticated(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  // Method to handle the signup process when a user wants to make an account.
  SignUp(email: string, password: string, firstName: string, lastName: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password) // Creating a new user account in Firebase Authentication using the provided email address and password
      .then((userCredential) => { // Making a promise, user info is stored in userCredential object. Has the user property, which contains uid, email of user
        const user = userCredential.user;
        let uid = '';

        // If information from user is not null then an email will be sent to verify email and the data will be sent to SetUserData method to send data to the database.
        if (user != null) {
          // Will send a verification email to the user
          this.SendVerificationMail();

          // Hashing the password
          const saltRounds = 10; // Number of times a random data string (known as a salt) is added to a password before it is hashed
          bcrypt.hash(password, saltRounds) // Passing in our password and the number of times we want to salt it
            .then((hashedPassword) => {
              this.SetUserData(user, email, hashedPassword, firstName, lastName, false, Date());
              uid = user.uid; // Storing the uid from the user object

              // Save additional user data to Firestore
              // Specifying the information that needs to be sent to the database
              this.afs.collection('users').doc(user.uid).set({
                uid: uid,
                email: email,
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName,
                emailVerified: false,
                accountCreated: new Date()
              });
              this.router.navigate(['/account']);
              console.log(`User with email ${user.email} signed up successfully`);
              this.setSuccessMessage("Account has been registered & signed in!");
              setTimeout(() => {
                this.clearSuccessMessage();
              }, 5000);  // Clear the error message after 5 seconds.
            })
            .catch((err) => {
              console.error(`Failed to hash password: ${err}`);
            });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Failed to sign up user: ${errorCode} - ${errorMessage}`);
        if (errorCode === 'auth/email-already-in-use') {
          this.setErrorMessage('The provided email is already in use by an existing user.');
        }
        else {
          this.setErrorMessage(`Failed to sign up user: ${errorCode} - ${errorMessage}`);
        }
        setTimeout(() => {
          this.clearErrorMessage();
        }, 5000);  // Clear the error message after 5 seconds.
      });
  }

  // Observables similar to an event handler to allow this information to be used in other files when the event happens
  // in this file, asynchronous.

  // Used to store the UID of the current signed-in user
  private iscurrentlySignedInUser = new BehaviorSubject<string>('');
  // Observable to be used in other files with the updated values, examples: navbar and route guards to see if user is signed in or not.
  public iscurrentlySignedIn = this.iscurrentlySignedInUser.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  // Observable to be used in other files with the updated values, examples: navbar and route guards to see if user is signed in or not.
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  // Used in route guard to see if it is set to false or true
  public signInInProgress = new BehaviorSubject<boolean>(false);

  // Method is used to handle the signin process of logging a valid user in.
  SignIn(email: string, password: string) {
    this.signInInProgress.next(true);
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user != null) {
          console.log(`User with email ${user.email} signed in successfully`);
          this.iscurrentlySignedInUser.next(user.uid);
          this.isAuthenticatedSubject.next(true);

          // // Log the current value
          // this.isAuthenticated.subscribe(
          //   isAuthenticated => {
          //     console.log(isAuthenticated);
          //   }
          // );

          // // Log the current value
          // this.iscurrentlySignedIn.subscribe(
          //   iscurrentlySignedIn => {
          //     console.log(iscurrentlySignedIn);
          //   }
          // );

        }
        this.signInInProgress.next(false);
        return userCredential;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Failed to sign in user: ${errorCode} - ${errorMessage}`);
        this.signInInProgress.next(false);
      });
  }

  SignOut() {
    // Perform sign-out operation
    this.afAuth.signOut().then(() => {
      this.isAuthenticatedSubject.next(false);
      this.iscurrentlySignedInUser.next('');
      this.userData = null; // Update the userData property immediately
      sessionStorage.removeItem('user');
      console.log("User has signed out successfully");
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(`Failed to sign out user: ${errorCode} - ${errorMessage}`);
    });
  }



  // When the user makes an account a verification email will be sent to them to verify.
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((user: any) => {
        if (user != null) {
          // If user exists, send email verification
          return user.sendEmailVerification().then(() => {
            // FiXME -> WIll need to set emailVerfied to true when user clicks it
            const userRef = this.afs.collection('users').doc(user.uid);
            return userRef.set({ emailVerified: true }, { merge: true }) // Update emailVerified field to true in Firestore
              .then(() => {
                user.emailVerified = true; // Update emailVerified property in the local user object
                // Redirect the user to the email verification page
                this.router.navigate(['/verify_email']);
              })
              .catch((error) => {
                console.error('Failed to update emailVerified status:', error);
              });
          });
        }
      });
  }

  // Allow the user to be able to reset their password
  async PasswordReset(email: string) {
    try {
      // Send a password reset email to the provided email address
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Password reset email sent, check your inbox.');
    } catch (error) {
      console.error(error);
    }
  }

  // This method allows the user to sign in with different accounts like Google, Facebook, or GitHub through a pop-up.
  // Only Google sign-in is implemented in this code snippet.
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

  // Allow the user to log in with their Google account
  GoogleAuth() {
    this.signInInProgress.next(true);  // Sign in process has started
    return this.AuthLogin(new GoogleAuthProvider())
      .then(() => {
        // Redirect to the account page after successful login
        this.signInInProgress.next(false);  // Sign in process has ended
        this.isAuthenticatedSubject.next(true);  // User is now authenticated
        this.router.navigate(['/account']);
        this.setSuccessMessage("Account has been signed in!");
        setTimeout(() => {
          this.clearSuccessMessage();
        }, 5000);  // Clear the error message after 5 seconds.
      })
      .catch((error) => {
        // Handle any errors here.
        this.signInInProgress.next(false);  // Sign in process has ended, regardless of outcome
      });
  }

  // Send data to firebase
  SetUserData(
    user: firebase.default.User, firstName: string, lastName: string, email: string,
    hashedPassword: string, emailVerified: boolean, accountCreated: string) {
    // Get a reference to the user document in the 'users' collection using the user's UID
    const userRef = this.afs.collection('users').doc(user.uid);

    // Create an object containing the user data to be stored in the document
    const userData = {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      uid: user.uid,
      emailVerified: emailVerified,
      accountCreated: accountCreated
    };
    // Set the user data in the document, merging with any existing data
    return userRef.set(userData, { merge: true })
      .then(() => {
        // Data was successfully added to the database
        console.log("User data added successfully");
      })
      .catch(error => {
        // An error occurred while adding data to the database
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`There was an error when trying to add user data: ${errorCode} - ${errorMessage}`);
      });
  }



  /* Code below is used for UI improvements */


  // Error messages that are being used with bootstrap for a better User Interface
  private errorMessageSource = new BehaviorSubject<string>('');
  public errorMessage$ = this.errorMessageSource.asObservable();

  // Method will show the error message
  public setErrorMessage(message: string) {
    this.errorMessageSource.next(message);
  }

  // Method will be used to clear the error message
  public clearErrorMessage() {
    this.errorMessageSource.next('');
  }

  // Success messages that are being used with bootstrap for a better User Interface
  private successMessageSource = new BehaviorSubject<string>('');
  public successMessage$ = this.successMessageSource.asObservable();


  public setSuccessMessage(message: string) {
    this.successMessageSource.next(message);
  }


  public clearSuccessMessage() {
    this.successMessageSource.next('');
  }


}

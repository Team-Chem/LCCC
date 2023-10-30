import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

class UserToken { }
class Permissions {
    canActivate(): boolean {
        return true;
    }
}


@Injectable({
    providedIn: 'root'
})

// Route Guard used to protect the data entry and account page from being accessed if user is not signed in.
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) { };


    // Get the UID of the current user who is signed in
    // userId: string = '';
    // getCurrentUserUID(): void {
    //     this.afAuth.user.subscribe(user => {
    //         if (user) {
    //             this.userId = user.uid;
    //             console.log('Current user UID:', this.userId);
    //         } else {
    //             // User is not signed in
    //             console.log('No user is currently signed in');
    //         }
    //     });
    // }


    // Route guard that will grant access if user has signed in and if not redirect to the sign in page. --> observable is grabbed from the auth.service.ts file
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.signInInProgress.pipe(
            filter(signInInProgress => !signInInProgress), // wait until sign-in process completes.
            switchMap(() => {
                // If user data is available in localStorage, consider the user as authenticated.
                if (this.authService.isUserAuthenticated()) {
                    return of(true);
                }
                // Otherwise, check authentication status.
                return this.authService.isAuthenticated;
            }),
            take(1), // only take the first value emitted
            map(isAuthenticated => {
                if (isAuthenticated) {
                    // console.log("Route Guard Success! User is authenticated.");
                    return true;
                } else {
                    // console.log("Route Guard Failure! User is not authenticated.");
                    this.authService.setErrorMessage('Must be signed in to access this page!');
                    setTimeout(() => {
                        this.authService.clearErrorMessage();
                    }, 5000);  // Clear the error message after 5 seconds.
                    return this.router.createUrlTree(['/sign_in']);
                }
            })
        );
    }
}

// Route Guard to protect the sign-in page from being accessed by an already signed in user. FIXME
export class PreventAccessSignIn implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) { };

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.signInInProgress.pipe(
            filter(signInInProgress => !signInInProgress),
            switchMap(() => this.authService.isAuthenticated),
            take(1),
            map(isAuthenticated => {
                if (isAuthenticated) {
                    // If user is authenticated, redirect them to the account page
                    return this.router.createUrlTree(['/account']);
                } else {
                    // If user is not authenticated, allow them to navigate to the sign_in page
                    return true;
                }
            })
        );
    }
}

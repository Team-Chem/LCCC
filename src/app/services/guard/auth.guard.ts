import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private afAuth: AngularFireAuth) { };


    // Get the UID of the current user who is signed in
    userId: string = '';
    getCurrentUserUID(): void {
        this.afAuth.user.subscribe(user => {
            if (user) {
                this.userId = user.uid;
                console.log('Current user UID:', this.userId);
            } else {
                // User is not signed in
                console.log('No user is currently signed in');
            }
        });
    }


    // Route guard that will grant access if user has signed in and if not redirect to the sign in page
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {

        this.getCurrentUserUID(); // Will run function and update userId with the UID
        if (this.userId !== '') { // FIXME <-- user has to click contineu button for it to redirect
            return true
        } else {
            this.router.navigate(['/sign_in']);
            return false;
        }
    }

}

import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     @Inject(AuthService) public authService: AuthService,
//     public router: Router
//   ){ }
//   canActivate(
//     next: ActivatedRouteSnapshot,
    // route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//       if(this.authService.isLoggedIn !== true) {
//         this.router.navigate(['sign-in'])
//       }
//       return true;
//   }
  
// }

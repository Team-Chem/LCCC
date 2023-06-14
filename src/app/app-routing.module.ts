import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { SignInComponent } from "./account/sign-in/sign-in.component";
import { SignUpComponent } from "./account/sign-up/sign-up.component";
import { PasswordResetComponent } from "./account/authentication/password-reset/password-reset.component";
import { VerifyEmailComponent } from "./account/authentication/verify-email/verify-email.component";
import { DashboardComponent } from "./account/dashboard/dashboard.component";
import { AccountComponent } from "./account/account.component";
import { MainSearchComponent } from "./search/main-search/main-search.component";
import { AuthGuard } from "./services/guard/auth.guard";
import { PolymerEntryFormComponent } from "./polymer-entry-form/polymer-entry-form.component";

// Route guard
// import { AuthGuard } from "./services/guard/auth.guard";

const appRoutes: Routes = [
    { path: '', component: AboutComponent },
    { path: 'sign_up', component: SignUpComponent },
    { path: 'sign_in', component: SignInComponent },
    { path: 'about', component: AboutComponent },
    { path: 'password_reset', component: PasswordResetComponent },
    { path: 'verify_email', component: VerifyEmailComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'search', component: MainSearchComponent },
    { path: 'polymer-entry-form', component: PolymerEntryFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}

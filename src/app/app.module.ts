import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
//import { MatIconModule} from "@angular/material/icon";

import { AppComponent } from './app.component';
import { GlobalsComponent } from './globals/globals.component';
import { NavbarComponent } from './globals/navbar/navbar.component';
import { ContactComponent } from './globals/contact/contact.component';
import { AlertsComponent } from './globals/alerts/alerts.component';
import { SuccessComponent } from './globals/alerts/success/success.component';
import { InfoComponent } from './globals/alerts/info/info.component';
import { WarningComponent } from './globals/alerts/warning/warning.component';
import { DangerComponent } from './globals/alerts/danger/danger.component';
import { PrimaryComponent } from './globals/alerts/primary/primary.component';
import { SecondaryComponent } from './globals/alerts/secondary/secondary.component';
import { DarkComponent } from './globals/alerts/dark/dark.component';
import { LightComponent } from './globals/alerts/light/light.component';
import { SearchComponent } from './search/search.component';
import { MainSearchComponent } from './search/main-search/main-search.component';
import { SubSearchComponent } from './search/sub-search/sub-search.component';
import { ResultsComponent } from './search/results/results.component';
import { AccountComponent } from './account/account.component';
import { AuthenticationComponent } from './account/authentication/authentication.component';
import { ReCaptchaComponent } from './account/authentication/re-captcha/re-captcha.component';
import { PasswordResetComponent } from './account/authentication/password-reset/password-reset.component';
import { ManagementComponent } from './account/management/management.component';
import { PrivilegesComponent } from './account/management/privileges/privileges.component';
import { UserAccessComponent } from './account/management/user-access/user-access.component';
import { UserCommComponent } from './account/user_comm/chat-communication.component';
import { ChatBotComponent } from './account/chat-bot/chat-bot.component';
import { AboutUserComponent } from './account/about-user/about-user.component';
import { AboutComponent } from './about/about.component';
import { FooterComponent } from './globals/footer/footer.component';
import { SignUpComponent } from './account/sign-up/sign-up.component';
import { SignInComponent } from './account/sign-in/sign-in.component';
import { AppRoutingModule } from './app-routing.module';
import { VerifyEmailComponent } from './account/authentication/verify-email/verify-email.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { PolymerEntryFormComponent } from "./polymer-entry-form/polymer-entry-form.component";

// Firebase import for services and environment variable
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AuthService } from './services/auth.service';
import { DashboardComponent } from './account/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
//import { MatIconModule } from



@NgModule({
  declarations: [
    AppComponent,
    GlobalsComponent,
    NavbarComponent,
    ContactComponent,
    AlertsComponent,
    SuccessComponent,
    InfoComponent,
    WarningComponent,
    DangerComponent,
    PrimaryComponent,
    SecondaryComponent,
    DarkComponent,
    LightComponent,
    SearchComponent,
    MainSearchComponent,
    SubSearchComponent,
    ResultsComponent,
    AccountComponent,
    AuthenticationComponent,
    ReCaptchaComponent,
    PasswordResetComponent,
    ManagementComponent,
    PrivilegesComponent,
    UserAccessComponent,
    UserCommComponent,
    ChatBotComponent,
    AboutUserComponent,
    AboutComponent,
    FooterComponent,
    SignUpComponent,
    SignInComponent,
    VerifyEmailComponent,
    DashboardComponent,
    PolymerEntryFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
    //BrowserAnimationsModule,
    //MatIconModule
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

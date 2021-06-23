import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import{MatTableModule} from '@angular/material/table';
import{MatPaginatorModule} from '@angular/material/paginator'; 
import{MatProgressBarModule} from '@angular/material/progress-bar';
import{MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';

import{RecaptchaModule, RecaptchaFormsModule} from 'ng-recaptcha';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { ResetComponent } from './auth/reset/reset.component';
import { GuestComponent } from './books/guest/guest.component';
import { ReguserComponent } from './books/reguser/reguser.component';
import { AddbookComponent } from './books/addbook/addbook.component';
import { BookComponent } from './books/book/book.component';
import { ResetLoginComponent } from './auth/reset-login/reset-login.component';
import { BookreguserComponent } from './books/bookreguser/bookreguser.component';
import { StarComponent } from './books/star/star.component';
import { ViewUserComponent } from './books/view-user/view-user.component';
import { AddEventComponent } from './books/add-event/add-event.component';
import { EventComponent } from './books/event/event.component';
import { ShowEventsComponent } from './books/show-events/show-events.component';
import { OdobriKnjigeComponent } from './books/odobri-knjige/odobri-knjige.component';
import { OdobriKorisnikeComponent } from './auth/odobri-korisnike/odobri-korisnike.component';
import { ZanrComponent } from './books/zanr/zanr.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SignupComponent,
    ForgotComponent,
    ResetComponent,
    GuestComponent,
    ReguserComponent,
    AddbookComponent,
    BookComponent,
    ResetLoginComponent,
    BookreguserComponent,
    StarComponent,
    ViewUserComponent,
    AddEventComponent,
    EventComponent,
    ShowEventsComponent,
    OdobriKnjigeComponent,
    OdobriKorisnikeComponent,
    ZanrComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatExpansionModule,
    BrowserModule,
    MatStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

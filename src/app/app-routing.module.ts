import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetComponent } from './auth/reset/reset.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { GuestComponent } from './books/guest/guest.component';
import { ReguserComponent } from './books/reguser/reguser.component';
import { AddbookComponent } from './books/addbook/addbook.component';
import { BookComponent } from './books/book/book.component';
import { ResetLoginComponent } from './auth/reset-login/reset-login.component';
import { BookreguserComponent } from './books/bookreguser/bookreguser.component';
import { ViewUserComponent } from './books/view-user/view-user.component';
import { EventComponent } from './books/event/event.component';
import { ShowEventsComponent } from './books/show-events/show-events.component';
import { AddEventComponent } from './books/add-event/add-event.component';
import { OdobriKorisnikeComponent } from './auth/odobri-korisnike/odobri-korisnike.component';
import { ZanrComponent } from './books/zanr/zanr.component';
import { OdobriKnjigeComponent } from './books/odobri-knjige/odobri-knjige.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: SignupComponent},
  {path: 'reset/:token', component: ResetComponent},
  {path: 'forgot', component: ForgotComponent},
  {path: 'guest', component: GuestComponent},
  {path: 'reguser', component:ReguserComponent},
  {path: 'addbook', component: AddbookComponent},
  {path: 'book/:id', component: BookComponent},
  {path: 'resetLogin', component: ResetLoginComponent},
  {path: 'bookreg/:id', component: BookreguserComponent},
  {path: 'user/:id', component: ViewUserComponent},
  {path: 'event/:id', component: EventComponent},
  {path: 'events', component: ShowEventsComponent},
  {path: 'addEvent', component: AddEventComponent},
  {path: 'odobriKorisnike', component: OdobriKorisnikeComponent},
  {path: 'odobriKnjige', component: OdobriKnjigeComponent},
  {path: 'zanrovi', component: ZanrComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

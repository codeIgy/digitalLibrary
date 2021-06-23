import { Injectable } from '@angular/core';
import { AuthData } from './login/authdata.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './signup/user.model';
import { Subject } from 'rxjs';

const BACKEND = 'http://localhost:3000/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authMessageListener = new Subject<string>();
  private token: string;

  user: User = null;
  private authUserListener = new Subject<User>();
  

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string){
    const authData: AuthData = {username: username, password: password};
    this.http.post<{token: string, user: User}>('http://localhost:3000/users/login', authData)
    .subscribe(response => {
      console.log(response);
      const token = response.token;
      this.token = token;
      if(token){
        this.user = response.user;
        this.authUserListener.next(this.user);
        this.router.navigate(['/reguser']);
      }
    }, error => {
        this.authMessageListener.next(error.error.message);
    });
  }

  createUser(name: string, lastName: string, username: string, password: string, date: string, city: string, country: string, 
    email: string, image: File, captchaResponse: string){
    const user = new FormData();
    user.append('name', name);
    user.append('lastname', lastName);
    user.append('username', username);
    user.append('password', password);
    user.append('date', date);
    user.append('city', city);
    user.append('country', country);
    user.append('email', email);
    user.append('captcha', captchaResponse);
    if(image) user.append('image', image, username);
    console.log(user);
    this.http.post<{message: string, user: User}>(BACKEND + '/signup', user)
    .subscribe(responseData =>{
      console.log(responseData);
      this.router.navigate(['/']);//stranica gdje se ceka odobrenje admina
    },error => {
      console.log(error);
    })
  }

  getAuthMessageListener(){
    return this.authMessageListener.asObservable();
  }

  forgot(email: string):any{
    let data = {email: email};
    return this.http.post<any>(BACKEND + '/forgot', data);
  }

  reset(password: string, token: string):any{
    return this.http.post<any>(BACKEND + '/reset', {password: password, token: token});
  }

  getUser(){
    return this.user;
  }

  getUserListener(){
    return this.authUserListener.asObservable();
  }

  resetLogin(passwordOld: string, password: string):any{
    return this.http.post<any>(BACKEND + '/resetLogin', {password: password, passwordOld: passwordOld, user: this.user});
  }


  logout(){
    this.user = null;
    this.token = null;
    this.authUserListener.next(null);
    this.router.navigate(['/']);
  }

  updateUser(_id: string, name: string, lastname: string, username: string, date: string, city: string, country: string, email: string, imagePath: string | File){
    let userData;
    if(typeof(imagePath)==='object'){
      userData = new FormData();
      userData.append('_id', _id);
      userData.append('name', name);
      userData.append('lastname', lastname);
      userData.append('username', username);
      userData.append('city', city);
      userData.append('country', country);
      userData.append('email', email);
      userData.append('image', imagePath, username);
      userData.append('date', date);
    }
    else{
      userData = {
        _id: _id,
        name: name,
        lastname: lastname,
        username: username,
        city: city,
        country: country,
        email: email,
        imagePath: imagePath,
        date: date
      }
    }
    return this.http.patch<{message: string, user: User}>(BACKEND + '/updateUser', userData);
  }

  setUser(u: User){
    this.user = u;
  }

  getUserById(logged: string, user: string){
    return this.http.get<{message: string, user: User, prati: boolean}>(BACKEND + '/getUserById' + `?logged_id=${logged}&user_id=${user}`);
  }

  zapratio(logged: string, user: string){
    return this.http.post<{message: string}>(BACKEND + '/follow', {logged_id: logged, user_id: user}).subscribe(res => {}, err => {});
  }

  nePrati(logged: string, user: string){
    return this.http.post<{message: string}>(BACKEND + '/unfollow', {logged_id: logged, user_id: user}).subscribe(res => {}, err => {});
  }

  odobriKorisnika(user_id: string){
    return this.http.post<{message: string}>(BACKEND + '/odobriKorisnika',{user_id: user_id});
  }

  neOdobriKorisnika(user_id: string){
    return this.http.post<{message: string}>(BACKEND + '/neOdobriKorisnika', {user_id: user_id});
  }
  postaviKaoModerator(user_id: string){
    return this.http.post<{message: string}>(BACKEND + '/postaviNaModeratora', {user_id: user_id});
  }
  postaviKaoNormalni(user_id: string){
    return this.http.post<{message: string}>(BACKEND + '/postaviNaNormalnog', {user_id: user_id});
  }
}

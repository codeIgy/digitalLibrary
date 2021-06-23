import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { passwordValidator, passwordsDontMatch } from './password.validators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  tried: boolean = false;
  form: FormGroup;
  private captchaResponse: string = '';
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
      this.form = new FormGroup({
        'name': new FormControl(null, {validators: Validators.required}),
        'lastName': new FormControl(null, {validators: Validators.required}),
        'username': new FormControl(null, {validators: Validators.required}),
        'password': new FormControl(null, {validators: [Validators.required, passwordValidator(/^(?=.*\d)(?=.*[A-Z])(?=.*\W)([A-Z]|[a-z]).{6,}$/)]}),
        'passwordConfirmation': new FormControl(null, {validators: Validators.required}),
        'date': new FormControl(null, {validators: Validators.required}),
        'city': new FormControl(null, {validators: Validators.required}),
        'country': new FormControl(null, {validators: Validators.required}),
        'email': new FormControl(null, {validators: Validators.required}),
        'image': new FormControl(null,null),
        'recaptcha': new FormControl(null,{validators: Validators.required})
      }, { validators: [passwordsDontMatch] });
  }

  register(){
    if(this.form.invalid){
      this.tried = true;
      return;
    }
    this.authService.createUser(this.form.value.name, this.form.value.lastName,this.form.value.username, this.form.value.password,
      this.form.value.date, this.form.value.city, this.form.value.country, this.form.value.email, this.form.value.image, this.captchaResponse);
  }

  imagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved response token: ${captchaResponse}`);
    this.captchaResponse = captchaResponse;
  }


  
  
}

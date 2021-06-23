import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { passwordsDontMatch, passwordValidator } from '../signup/password.validators';

@Component({
  selector: 'app-reset-login',
  templateUrl: './reset-login.component.html',
  styleUrls: ['./reset-login.component.css']
})
export class ResetLoginComponent implements OnInit {

  form: FormGroup;
  message: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'passwordOld': new FormControl(null,{validators: [Validators.required]}),
      'password': new FormControl(null, {validators: [Validators.required, passwordValidator(/^(?=.*\d)(?=.*[A-Z])(?=.*\W)([A-Z]|[a-z]).{6,}$/)]}),
      'passwordConfirmation': new FormControl(null, {validators: Validators.required})
    },{ validators: [passwordsDontMatch] });
  }

  reset(){
    if(this.form.invalid){
      return;
    }
    this.authService.resetLogin( this.form.value.passwordOld, this.form.value.password)
    .subscribe(res => {
      this.message = 'Lozinka je uspješno promijenjena!'
    }, err => {
      console.log(err);
      this.message = 'Neispravna stara lozinka!'
    })
  }
}

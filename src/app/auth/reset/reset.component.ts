import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordValidator, passwordsDontMatch } from '../signup/password.validators';
import { AuthService } from '../auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  form: FormGroup;
  message: string;
  token: string;

  constructor(private authService: AuthService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((ParamMap: ParamMap)=>{
      this.token = ParamMap.get('token');
      //console.log(this.token);
    })
    this.form = new FormGroup({
      'password': new FormControl(null, {validators: [Validators.required, passwordValidator(/^(?=.*\d)(?=.*[A-Z])(?=.*\W)([A-Z]|[a-z]).{6,}$/)]}),
      'passwordConfirmation': new FormControl(null, {validators: Validators.required})
    },{ validators: [passwordsDontMatch] });
  }

  reset(){
    if(this.form.invalid){
      return;
    }
    this.authService.reset(this.form.value.password, this.token)
    .subscribe(res => {
      this.message = 'Lozinka je uspješno promijenjena!'
    }, err => {
      console.log(err);
      this.message = 'Došlo je do greške - Pokušajte opet.'
    })
  }

}

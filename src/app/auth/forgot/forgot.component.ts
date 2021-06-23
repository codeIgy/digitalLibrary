import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  message: string;
  private authMessageListener: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.message=''
  }

  onSubmit(form: NgForm){
    if(form.invalid){
      return;
    }
    console.log(form.value.email);
    this.authService.forgot(form.value.email)
    .subscribe(res =>{
      this.message='Link za oporavak lozinke poslat na email.'
    }, error =>{
      this.message='Ne postoji data email adresa.'
    })
    
  }

}

import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'login.component.html',
    styleUrls:['login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
    
    private authMessageSub: Subscription;
    message: string;

    ngOnInit(){
        this.message=null;
        this.authMessageSub = this.authService.getAuthMessageListener().subscribe(mess =>{
            console.log(mess);
            this.message = mess;
        })
    }

    constructor(private authService: AuthService){}

    onLogin(form: NgForm){
        if(form.invalid){
            return;
        }
        this.authService.login(form.value.username, form.value.password);
    }

    ngOnDestroy(){
        this.authMessageSub.unsubscribe();
    }
}
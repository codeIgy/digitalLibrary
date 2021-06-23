import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/signup/user.model';

@Component({
    templateUrl: 'header.component.html',
    styleUrls:['header.component.css'],
    selector: 'app-header'
})
export class HeaderComponent implements OnInit, OnDestroy{

    user: User;
    private authListener : Subscription;

    constructor(private authService: AuthService){}

    ngOnInit(){
        this.user = this.authService.getUser();
        this.authListener = this.authService.getUserListener().subscribe(user => {
            this.user = user;
        })
    }

    logout(){
        this.authService.logout();
    }

    ngOnDestroy(){
        this.authListener.unsubscribe();
    }
}
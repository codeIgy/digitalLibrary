import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/signup/user.model';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  constructor(public authService: AuthService, private route: ActivatedRoute) { }

  user: User;
  loggedUser: User;
  prati: boolean = false;

  ngOnInit(): void {
    this.loggedUser = this.authService.getUser();
    this.route.paramMap.subscribe((ParamMap: ParamMap) => {
      let token = ParamMap.get('id');
      this.authService.getUserById(this.loggedUser._id, token).subscribe(result => {
        this.user = result.user;
        this.prati = result.prati;
      }, err => {
        this.loggedUser = null;
      })
    })
  }


  konvertujDatum(d: Date): string {
    return d ? d.toString().substr(0, 10) : null;
  }
  
  zaprati(){
    this.authService.zapratio(this.loggedUser._id, this.user._id);
    this.prati = true;
  }

  otprati(){
    this.authService.nePrati(this.loggedUser._id, this.user._id);
    this.prati = false;
  }

  postaviKaoModerator(){
    this.authService.postaviKaoModerator(this.user._id).subscribe(result => {
      this.user.type='moderator';
    }, err => {

    });
  }
  postaviKaoNormalni(){
    this.authService.postaviKaoNormalni(this.user._id).subscribe(result => {
      this.user.type='normalni';
    }, err => {

    });
  }
}

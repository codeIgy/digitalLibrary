import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/signup/user.model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  constructor(private bookService: BookService, private authService: AuthService, private router: Router) { }

  user: User;
  following: User[] = [];
  form: FormGroup;
  secondFormGroup: FormGroup;
  columndefs : any[] = ['naziv','dodaj'];
  added: string[] = [];

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.bookService.getFollowing(this.user._id).subscribe(result => {
      this.following = result.following;
    }, err => {
      console.log(err);
      this.following = [];
    })
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: Validators.required}),
      'start': new FormControl(null, {validators: Validators.required}),
      'end': new FormControl(null, {validators: Validators.required}),
      'now': new FormControl(false, {validators: Validators.required}),
      'endless': new FormControl(false, {validators: Validators.required}),
      'description': new FormControl(null, null)
    })
    this.secondFormGroup = new FormGroup({
      'javni': new FormControl(null)
    });
  }

  valid(): boolean{
    return (this.form.get("start").valid || this.form.get("now").value) && (this.form.get("end").valid || this.form.get("endless").value) && this.form.get("title").valid;
  }

  kreiraj(){
    console.log(this.form.get('start').value);
    console.log(this.form.get('end').value);
    this.bookService.addEvent(this.form.get('title').value, this.form.get('start').value, this.form.get('end').value, this.form.get('now').value, this.form.get('endless').value, this.form.get('description').value, this.secondFormGroup.get('javni').value, this.added, this.user._id)
    .subscribe(result => {
      this.router.navigate(['/events']);
    }, err => {

    });
  }

  addUser(user_id: string){
    this.added.push(user_id);
  }
}

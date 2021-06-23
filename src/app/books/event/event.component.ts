import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/signup/user.model';
import { BookService } from '../book.service';
import { Event } from '../model/event';
import { EventComment } from '../model/eventComment';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  event: Event = null;
  comments: EventComment[] = [];
  user: User = null;
  awaitingUsers: User[] = [];
  komentar: string = '';
  columndefs: any[] = ['username', 'prihvati'];

  constructor(private bookService: BookService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user != null) {
      this.route.paramMap.subscribe((ParamMap: ParamMap) => {
        let token = ParamMap.get('id');
        this.bookService.getEventById(token).subscribe(result => {
          this.event = result.event;
          console.log(this.event);
          this.awaitingUsers = this.event.awaiting;
          if(this.event.type == 'javni' || this.event.participants.includes(this.user._id)){
            this.bookService.getEventComments(token).subscribe(result => {
              this.comments = result.comments;
            },err => {

            });
          }
        }, err => {

        })
      }, err => {

      })
    }
  }

  addRequest() {
    this.bookService.addEventRequest(this.user._id, this.event._id).subscribe(result => {
      this.event.awaiting.push(this.user);
    });
  }

  awaiting(id: string): boolean{
    for(let i = 0; i < this.event.awaiting.length;i++){
      if(this.event.awaiting[i]._id == id) return true;
    }
    return false;
  }

  acceptRequest(id: string){
    this.bookService.acceptRequest(id, this.event._id).subscribe(result => {
      this.awaitingUsers = this.awaitingUsers.filter(u => u._id != id);
    }, err => {

    });
  }

  declineRequest(id: string){
    this.bookService.declineRequest(id, this.event._id).subscribe(result => {
      this.awaitingUsers = this.awaitingUsers.filter(u => u._id != id);
    },err =>{

    })
  }

  addComment(){
    this.bookService.addEventComment(this.user._id,this.komentar, this.event._id).subscribe(result => {
      let comment: EventComment = {_id: '', author: this.user, comment:this.komentar};
      this.comments.push(comment);
    }, err => {
      
    })
  }

  
  konvertujDatum(d: Date): string {
    return d ? d.toString().substr(0, 10) + ' ' + d.toString().substr(11,5): null;
  }

  pridruziSe(){
    return !(this.event.participants.includes(this.user._id) || this.awaiting(this.user._id)) && this.event.type == "privatni" && (new Date(this.event.start).valueOf() < new Date().valueOf()) && (this.event.endless || (new Date(this.event.end).valueOf()  > new Date().valueOf()));
  }
  
  aktiviraj(){
    return (this.event.creator._id == this.user._id) && (!this.event.endless && (new Date(this.event.end).valueOf() < new Date().valueOf()));
  }

  zaustavi(){

    return (this.event.creator._id == this.user._id) && (this.event.endless || (new Date(this.event.end).valueOf() > new Date().valueOf())) && (new Date(this.event.start).valueOf() < new Date().valueOf());
  }

  aktivirajDogadjaj(){
    this.bookService.activateEvent(this.event._id).subscribe(result => {
      this.event.endless = true;
      this.event.start = new Date();
    }, err => {

    })
  }

  zaustaviDogadjaj(){
    this.bookService.stopEvent(this.event._id).subscribe(result => {
      this.event.end = new Date();
      this.event.endless = false;
    }, err => {

    })
  }
}

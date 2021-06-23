import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/signup/user.model';
import { BookService } from '../book.service';
import { Event } from '../model/event';

@Component({
  selector: 'app-show-events',
  templateUrl: './show-events.component.html',
  styleUrls: ['./show-events.component.css']
})
export class ShowEventsComponent implements OnInit {


  events: Event[] = [];
  columndefs: any[] = ['naziv', 'pocetak', 'kraj'];
  user: User = null;
  constructor(private bookService: BookService, private authService: AuthService) { }


  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.bookService.getAllEvents().subscribe(result => {
      this.events = result.events;
      if(this.user == null){
        let now = new Date();
        this.events = this.events.filter(p => p.endless || (p.end.getMilliseconds() > now.getMilliseconds()));
      }
    },err => {
      this.events = [];
    })
  }

  konvertujDatum(d: Date):string{
    return d  ? d.toString().substr(0,10) + ' ' + d.toString().substr(11,5) : null;
  }

}

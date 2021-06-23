import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/signup/user.model';
import { BookService } from '../book.service';
import { Book } from '../model/book';
import { Comment } from '../model/comment';
import { Genre } from '../model/genre';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit,OnDestroy {

  user: User;
  book: Book;
  bookListener: Subscription;
  loaded: boolean;

  comments: Comment[] = [];

  constructor(private authService: AuthService, private bookService: BookService, private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.bookListener.unsubscribe();
  }

  ngOnInit(): void {
    this.book = null;
    this.user = this.authService.getUser();
    this.bookListener = this.bookService.getBookListener().subscribe(bookRes => {
      console.log(bookRes);
      this.loaded = true;
      this.book = bookRes;
    })
    this.route.paramMap.subscribe((ParamMap: ParamMap)=>{
      let token = ParamMap.get('id');
      this.bookService.getBook(token);
      this.bookService.getComments(token).subscribe(result => {
        this.comments = result.comments;
      }, err => {

      })
    });
  }

  konvertujDatum(d: Date):string{
    return d  ? d.toString().substr(0,10) : null;
  }

  ispisiZanrove(genre: Genre[]): string{
    let a = "";
    console.log(genre);
    genre.forEach(element => {
      a += element.name + ', ';
    });
    return a.substr(0,a.length - 2);
  }
}

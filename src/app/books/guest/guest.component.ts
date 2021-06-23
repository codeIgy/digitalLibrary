import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BookService } from '../book.service';
import { Genre } from '../model/genre';
import { Subscription } from 'rxjs';
import { Book } from '../model/book';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit, OnDestroy {

  constructor(private bookService: BookService) { }
  
  genres: Genre[];
  private genresSub: Subscription;
  resultBooks: Book[] = [];
  private booksSub: Subscription;
  columndefs : any[] = ['naziv','autori', 'zanr', 'datum'];

  ngOnInit(): void {
    this.bookService.updateGenres();
    this.genres = this.bookService.getGenres();
    this.genresSub = this.bookService.getGenresListener().subscribe(result =>{
      this.genres = result;
    });
    this.resultBooks = this.bookService.getSearchedBooks();
    this.booksSub = this.bookService.getBooksSearchListener().subscribe(result => {
      this.resultBooks = result;
    });
  }

  search(form: NgForm){//dodati nakon dodavanja registrovanog korisnika
    this.bookService.searchBooks(form.value.title, form.value.author, form.value.genre);
    console.log(form.value.author);
  }

  konvertujDatum(d: Date):string{
    return d  ? d.toString().substr(0,10) : null;
  }

  ispisiZanr(zanr: Genre[]):string{
    let s : string = "";
    zanr.forEach(zanr => {
      s = s.concat(zanr.name + ', ')
    });
    return s.substr(0, s.length - 2);
  }

  ngOnDestroy(): void {
    this.genresSub.unsubscribe();
    this.booksSub.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookService } from '../book.service';
import { Book } from '../model/book';
import { Genre } from '../model/genre';

@Component({
  selector: 'app-odobri-knjige',
  templateUrl: './odobri-knjige.component.html',
  styleUrls: ['./odobri-knjige.component.css']
})
export class OdobriKnjigeComponent implements OnInit {
  books: Book[] = [];
  bookSubscription: Subscription;
  columndefs : any[] = ['naziv','autori', 'zanr', 'datum', 'akcija'];

  constructor(private bookService:  BookService) { }

  ngOnInit(): void {
    this.bookSubscription = this.bookService.getBooksSearchListener().subscribe(next => {
      this.books = next.filter(p => p.odobrena == false);
    });
    this.bookService.searchBooks('','','');
  }

  odobriKnjigu(book_id: string){
    this.bookService.odobriKnjigu(book_id).subscribe(result =>{
      this.books = this.books.filter(p => p._id != book_id);
    }, err => {

    })
  }

  neOdobriKnjigu(book_id: string){
    this.bookService.neOdobriKnjigu(book_id).subscribe(result =>{
      this.books = this.books.filter(p => p._id != book_id);
    }, err => {

    })
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

}

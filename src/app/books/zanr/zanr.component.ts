import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
import { Subscription } from 'rxjs';
import { BookService } from '../book.service';
import { Genre } from '../model/genre';

@Component({
  selector: 'app-zanr',
  templateUrl: './zanr.component.html',
  styleUrls: ['./zanr.component.css']
})
export class ZanrComponent implements OnInit {
  genres: Genre[];
  private genresSub: Subscription;
  columndefs: any[] = ['naziv', 'akcija'];
  naziv: string = '';

  constructor(private bookService: BookService) { }
  poruka: string = '';
  ngOnInit(): void {
    this.bookService.updateGenres();
    this.genres = this.bookService.getGenres();
    this.genresSub = this.bookService.getGenresListener().subscribe(result => {
      this.genres = result;
    });
    this.poruka = '';
  }

  obrisi(genre_id: string) {
    this.bookService.deleteGenre(genre_id).subscribe(result => {
      if (result.message == 'Success') {
        this.poruka = '';
        this.genres = this.genres.filter(p => p._id != genre_id);
      }
      else {
        this.poruka = result.message;
      }
    })
  }

  dodaj() {
    this.bookService.dodajZanr(this.naziv)
      .subscribe(result => {
        this.naziv = '';
        this.bookService.updateGenres();
      }, err => {

      })
  }
}

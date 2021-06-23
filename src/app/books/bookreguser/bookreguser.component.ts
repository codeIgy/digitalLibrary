import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { from, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/signup/user.model';
import { BookService } from '../book.service';
import { Book } from '../model/book';
import { Genre } from '../model/genre';
import {Comment} from '../model/comment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bookreguser',
  templateUrl: './bookreguser.component.html',
  styleUrls: ['./bookreguser.component.css']
})
export class BookreguserComponent implements OnInit {
  user: User;
  book: Book;
  bookListener: Subscription;
  loaded: boolean;
  status: string;
  page: number = 0;
  size: number = 1;

  comments: Comment[] = [];
  ocjenio: boolean = false;
  poruka: string = '';
  komentar: string = '';
  ocjena: number = 1;
  _id: string;
  editsection: boolean = false;

  stars=[1,2,3,4,5,6,7,8,9,10];
  hoverState  = 0;

  form: FormGroup;
  change: Boolean = false;

  genres: Genre[];
  genresSub: Subscription;

  onStarEnter(starId: number){
    this.hoverState = starId;
  }

  onStarLeave(){
    this.hoverState = 0;
  }

  onStarClick(starId: number){
    this.ocjena= starId;
  }

  editComment(kom: Comment){
    this.komentar = kom.comment;
    this.ocjena = kom.score;
    this._id = kom._id;
    this.editsection = true;
  }

  edit() {
    if (this.komentar.split(' ').length >= 1000) {
      this.poruka = 'Komentar mora da sadrži  manje od 1000 riječi.'
      return;
    }
    this.poruka = '';
    this.editsection = false;
    this.bookService.editComment(this.user._id, this.book._id, this.komentar, this.ocjena, this._id).subscribe(result => {
      this.book.averageScore = result.averageScore;
      this.bookService.getCommentsReg(this.book._id).subscribe(result => {
        this.comments = result.comments;
      }, err => {
        this.comments = [];
      });
    });
  }

  addComment() {
    if (this.ocjenio) return;
    if (this.komentar.split(' ').length >= 1000) {
      this.poruka = 'Komentar mora da sadrži  manje od 1000 riječi.'
      return;
    }
    this.poruka = '';
    this.bookService.addComment(this.user._id, this.book._id, this.komentar, this.ocjena).subscribe(result => {
      this.book.averageScore = result.averageScore;
      let comment: Comment = {_id: result._id, author: this.user, book: this.book, comment: this.komentar, score: this.ocjena}; 

      this.comments.push(comment);
      this.ocjenio = true;
    }, err => {

    })
  }

  constructor(private authService: AuthService, private bookService: BookService, private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.bookListener.unsubscribe();
  }

  ngOnInit(): void {
    this.book = null;
    this.user = this.authService.getUser();
    this.bookService.updateGenres();
    this.genres = this.bookService.getGenres();
    this.genresSub = this.bookService.getGenresListener().subscribe(result =>{
      this.genres = result;
    })
    this.bookListener = this.bookService.getBookRegListener().subscribe(bookRes => {
      console.log(bookRes);
      this.loaded = true;
      this.book = bookRes.book;
      this.status = bookRes.status;

      this.page = bookRes.page;
      this.size = bookRes.size;
    })
    this.route.paramMap.subscribe((ParamMap: ParamMap) => {
      let token = ParamMap.get('id');
      if (this.user != null) {
        this.bookService.getBookReg(token, this.user._id);
        this.bookService.getCommentsReg(token).subscribe(result => {
          console.log(result);
          this.comments = result.comments;
          for (let i = 0; i < this.comments.length; i++) {
            if (this.comments[i].author._id == this.user._id) {
              this.ocjenio = true;
              break;
            }
          }
        }, err => {
          console.log('Error');
          this.comments = [];
        });
      }

    });

  }

  konvertujDatum(d: Date): string {
    return d ? d.toString().substr(0, 10) : null;
  }

  ispisiZanrove(genre: Genre[]): string {
    let a = "";
    genre.forEach(element => {
      a += element.name + ', ';
    });
    return a.substr(0, a.length - 2);
  }

  addToRead() {
    this.status = 'za_citanje';
    this.bookService.addToRead(this.user._id, this.book._id);
  }

  removeToRead() {
    this.status = '';
    this.bookService.ukloni(this.user, this.book).subscribe(res => {
    });
  }

  startReading() {

    console.log('brisanje')
    this.bookService.ukloni(this.user, this.book).subscribe(res => {
      console.log('obrisano');
      this.bookService.startReading(this.user._id, this.book._id);
    });
    this.status = 'cita';
  }

  finished() {
    this.status = 'procitao';
    this.bookService.finished(this.user._id, this.book._id);
  }

  changePageAndSize() {
    this.bookService.changePageAndSize(this.user._id, this.book._id, this.page, this.size);
  }

  changeBook(){
    this.form = new FormGroup({
      'image': new FormControl(this.book.imagePath,null),
      'title': new FormControl(this.book.title, {validators: Validators.required}),
      'author': new FormControl(this.book.authors.join(', '), {validators: Validators.required}),
      'issueDate': new FormControl(this.book.issueDate, {validators: Validators.required}),
      'genre': new FormControl(this.book.genre, {validators: [Validators.required, Validators.maxLength(3)]}),
      'description': new FormControl(this.book.description, null)
    });
    this.change = true;
  }
  update(){
    this.bookService.updateBook(this.book._id, this.form.get('image').value,this.form.get('title').value,this.form.get('author').value,this.form.get('description').value,this.form.get('issueDate').value,this.form.get('genre').value)
    .subscribe(result => {
      this.book = result.book;
      this.change = false;
    }, err => {

    })
  }

  imagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
  }

}

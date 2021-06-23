import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Genre } from './model/genre';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Book } from './model/book';
import { User } from '../auth/signup/user.model';
import { Comment } from './model/comment';
import { Event } from './model/event';
import { EventComment } from './model/eventComment';

const BACKEND = 'http://localhost:3000/books';
const BACKEND_USERS = 'http://localhost:3000/users';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient, private router: Router) { }

  genres: Genre[] = [];
  searchedBooks: Book[] = [];
  private genresUpdated = new Subject<Genre[]>();
  private booksSearch = new Subject<Book[]>();
  private addBookUpdated = new Subject<string>();
  private bookUpdated = new Subject<Book>();
  private bookRegUpdated = new Subject<{book: Book, status: string, page: number, size: number}>();

  getGenres(){
    return this.genres;
  }

  getAddBookListener(){
    return this.addBookUpdated.asObservable();
  }

  getGenresListener(){
    return this.genresUpdated.asObservable();
  }

  getBookRegListener(){
    return this.bookRegUpdated.asObservable();
  }

  getBooksSearchListener(){
    return this.booksSearch.asObservable();
  }

  updateGenres(){
    this.http.get<{message: string, genres: Genre[]}>(BACKEND + '/genres').subscribe(result => {
      this.genres = result.genres;
      this.genresUpdated.next(result.genres);
    })
  }

  addBook(title: string,image: File, author: string, issueDate: string, genre: string[], description: string){
    const book = new FormData();
    let authors = author.split(',');
    for(let i = 0; i < authors.length; i++){
      authors[i] = authors[i].trim();
    }
    
    book.append('title', title);
    book.append('author', authors.join('@'));
    book.append('issueDate', issueDate);
    book.append('genre', genre.join(' '));
    book.append('description', description);
    if(image) book.append('image', image, title + ' ' + authors.join(','));
    console.log(book);
    this.http.post<{message: string}>(BACKEND + '/add',book)
    .subscribe(responseData => {
      this.router.navigate(['/reguser']);//ispraviti za moderatora ili admina
    },err => {
      this.addBookUpdated.next('Neuspješno dodavanje knjige - pokušajte ponovo');//ostao ti multer i backend realizacija dodavanja knjige
    })
  }

  searchBooks(name: string, author: string, genre: string ){
    this.http.post<{message: string,books: Book[]}>(BACKEND + '/searchG', {name: name, author: author, genre: genre})
    .subscribe(responseData => {
      this.searchedBooks= responseData.books;
      this.booksSearch.next(
        [...this.searchedBooks]
      )
    });
  }

  getSearchedBooks(){
    return this.searchedBooks;
  }

  getBookListener(){
    return this.bookUpdated.asObservable();
  }

  getBook(id: string){
    this.http.get<{message: string, book: Book}>(BACKEND + `?book_id=${id}`)
    .subscribe(result => {
      console.log(result);
      this.bookUpdated.next(result.book);
    }, err => {
      console.log(err);
      this.bookUpdated.next(null);
    })
  }

  ukloni(u: User, b: Book){
    return this.http.delete<{message: string}>(BACKEND_USERS + '/toReadDelete' +`?user_id=${u._id}&book_id=${b._id}`);
  }

  getPages(readPage: number, readSize: number,isReadingPage: number, isReadingSize: number,toReadPage: number, toReadSize: number, user_id: string){
    return this.http.get<{message: string, read: Book[], readCount: number,
    toRead: Book[], toReadCount: number, isReading: Book[], isReadingCount: number}>(BACKEND + '/getPages' + `?user_id=${user_id}&currentPagetoRead=${toReadPage}&pageSizetoRead=${toReadSize}&currentPageRead=${readPage}&pageSizeRead=${readSize}&currentPageisReading=${isReadingPage}&pageSizeisReading=${isReadingSize}`);
  }

  getBookReg(id: string, user_id:string){
    this.http.get<{message: string, book: {book: Book, status: string, page: number, size: number}}>(BACKEND + '/reg' + `?book_id=${id}&user_id=${user_id}`)
    .subscribe(result => {
      console.log(result);
      this.bookRegUpdated.next(result.book);
    }, err => {
      console.log(err);
      this.bookRegUpdated.next(null);
    });
  }

  addToRead(user_id: string, book_id: string){
    this.http.post<{message: string}>(BACKEND_USERS + '/toRead' +`?user_id=${user_id}&book_id=${book_id}`,null).subscribe(res => {

    },err =>{

    });
  }

  startReading(user_id: string, book_id: string){
      this.http.post<{message: string}>(BACKEND_USERS + '/isReading' +`?user_id=${user_id}&book_id=${book_id}&page=0&size=100`,null).subscribe(res => {
  
      },err =>{
  
      });
  }

  finished(user_id: string, book_id: string){
    this.http.post<{message: string}>(BACKEND_USERS + '/read' +`?user_id=${user_id}&book_id=${book_id}`,null).subscribe(res => {
  
    },err =>{

    });
  }

  changePageAndSize(user_id: string, book_id: string,page: number, size:number){
    this.http.post<{message: string}>(BACKEND_USERS + '/updateRead' +`?user_id=${user_id}&book_id=${book_id}&page=${page}&size=${size}`,null).subscribe(res => {
  
    },err =>{

    });
  }

  editComment(user_id: string, book_id: string, comment: string, score: number, comm_id: string){
    console.log(comm_id);
    return this.http.patch<{message: string, averageScore: number}>(BACKEND + '/editComment',{book_id: book_id, comment: comment, score: score, comm_id: comm_id});
  }

  addComment(user_id: string, book_id: string, comment: string, score: number){
    return this.http.post<{message: string, averageScore: number, _id: string}>(BACKEND + '/addComment',{book_id: book_id, user_id: user_id, comment: comment, score: score});
  }

  getCommentsReg(book_id: string){
    return this.http.get<{message: string, comments: Comment[]}>(BACKEND + '/getCommentsReg' + `?book_id=${book_id}`);
  }

  getCommentsRegFront(user_id: string){
    return this.http.get<{message: string, comments: Comment[]}>(BACKEND_USERS + '/getCommentsReg' + `?user_id=${user_id}`);
  }

  getComments(book_id: string){
    return this.http.get<{message: string, comments: Comment[]}>(BACKEND + '/getComments' + `?book_id=${book_id}`);
  }

  searchUsers(name: string, lastname: string, username: string, email: string){
    return this.http.post<{message: string, users: User[]}>(BACKEND_USERS + '/searchUser',{name: name, lastname: lastname, username: username, email: email});
  }

  getAlerts(user_id: string){
    return this.http.get<{message: string, alerts: Comment[]}>(BACKEND + '/getAlerts' + `?user_id=${user_id}`);
  }

  addEvent(title: string, start: Date, end: Date, now: boolean, endless: boolean, description: string, javni: boolean, added: string[], user_id: string){
    return this.http.post<{message: string}>(BACKEND + '/addEvent', {title: title, start: start, end: end, now: now, endless: endless, description: description, javni: javni, added: added, user_id: user_id});
  }

  getAllEvents(){
    return this.http.get<{message: string, events: Event[]}>(BACKEND + '/getEvents');
  }

  getEventById(event_id: string){
    return this.http.get<{message: string, event: Event}>(BACKEND + '/getEventById' + `?event_id=${event_id}`);
  }

  getEventComments(event_id: string){
    return this.http.get<{message: string, comments: EventComment[]}>(BACKEND + '/getEventComments' + `?event_id=${event_id}`);
  }

  addEventRequest(user_id: string, event_id: string){
    return this.http.post<{message: string}>(BACKEND + '/addEventRequest',{user_id: user_id, event_id: event_id});
  }
  acceptRequest(user_id: string, event_id: string){
    return this.http.post<{message: string}>(BACKEND + '/acceptEventRequest',{user_id: user_id, event_id: event_id});
  }
  declineRequest(user_id: string, event_id: string){
    return this.http.post<{message: string}>(BACKEND + '/declineEventRequest',{user_id: user_id, event_id: event_id});
  }
  addEventComment(user_id: string, comment: string, event_id: string){
    return this.http.post<{message: string}>(BACKEND + '/commentEvent',{user_id: user_id, comment: comment, event_id: event_id});
  }
  getFollowing(user_id: string){
    return this.http.post<{message: string, following: User[]}>(BACKEND_USERS + '/getFollowing', {user_id: user_id});
  }
  activateEvent(event_id : string){
    return this.http.post<{message: string}>(BACKEND + '/activateEvent', {event_id: event_id});
  }
  stopEvent(event_id: string){
    return this.http.post<{message: string}>(BACKEND + '/stopEvent', {event_id: event_id});
  }
  odobriKnjigu(book_id: string){
    return this.http.post<{message: string}>(BACKEND + '/odobriKnjigu', {book_id: book_id});
  }

  neOdobriKnjigu(book_id: string){
    return this.http.post<{message: string}>(BACKEND + '/neOdobriKnjigu', {book_id: book_id});
  }

  deleteGenre(genre_id: string){
    return this.http.delete<{message: string}>(BACKEND + '/izbrisiZanr' + `?genre_id=${genre_id}`);
  }

  dodajZanr(naziv: string){
    return this.http.post<{message: string}>(BACKEND + '/dodajZanr',{naziv: naziv});
  }
  updateBook(book_id: string,  image: string | File, title: string, author: string, description: string, issueDate: string, genre: string[]){
    let bookData;
    const book = new FormData();
    let authors = author.split(',');
    for(let i = 0; i < authors.length; i++){
      authors[i] = authors[i].trim();
    }
    

    if(typeof(image)==='object'){
      bookData = new FormData();
      bookData.append('_id', book_id);
      book.append('title', title);
      book.append('author', authors.join('@'));
      book.append('issueDate', issueDate);
      book.append('genre', genre.join(' '));
      book.append('description', description);
      book.append('image', image, title + ' ' + authors.join(','));
    }
    else{
      bookData = {
        _id: book_id,
        title: title,
        imagePath: image,
        author: authors.join('@'),
        issueDate: issueDate,
        genre: genre.join(' '),
        description: description,
      }
    }
    return this.http.patch<{message: string, book: Book}>(BACKEND + '/updateBook', bookData);
  }
  getByGenres(){
    return this.http.get<{data:{y: number, name: string}}>(BACKEND + '/getByGenres');
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { passwordsDontMatch, passwordValidator } from 'src/app/auth/signup/password.validators';
import { User } from 'src/app/auth/signup/user.model';
import { BookService } from '../book.service';
import { Book } from '../model/book';
import { Comment } from '../model/comment';
import { Genre } from '../model/genre';
import * as CanvasJS from './canvasjs.min';

@Component({
  selector: 'app-reguser',
  templateUrl: './reguser.component.html',
  styleUrls: ['./reguser.component.css']
})
export class ReguserComponent implements OnInit, OnDestroy {

  genres: Genre[];
  private genresSub: Subscription;
  resultBooks: Book[] = [];
  private booksSub: Subscription;
  columndefs : any[] = ['naziv','autori', 'zanr', 'datum'];

  change: boolean;
  form: FormGroup;
  user: User;
  message: string;

  read: Book[] = [];
  isReading: Book[] = [];
  toRead: Book[] = [];

  readPageSize = 2;
  readCurrentPage = 1;
  readTotal = 0;

  isReadingPageSize = 2;
  isReadingCurrentPage = 1;
  isReadingTotal = 0;

  toReadPageSize = 2;
  toReadCurrentPage = 1;
  toReadTotal = 0;

  pageSizeOptions = [1, 2, 5, 10];


  columndefs2 : any[] = ['naziv','autori'];
  columndefs1 : any[] = ['naziv', 'autori', 'ukloni'];
  columndefs3: any[] = ['ime', 'prezime', 'username', 'email'];

  comments: Comment[] = [];
  searchedUsers: User[] = [];

  alerts: Comment[] = [];

  searched: boolean = false;

  constructor(private authService: AuthService, private bookService: BookService) { }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.user = this.authService.getUser();

    this.bookService.updateGenres();
    this.genres = this.bookService.getGenres();
    this.genresSub = this.bookService.getGenresListener().subscribe(result =>{
      this.genres = result;
    });
    this.resultBooks = this.bookService.getSearchedBooks();
    this.booksSub = this.bookService.getBooksSearchListener().subscribe(result => {
      this.resultBooks = result;
    });

    this.bookService.getAlerts(this.user._id).subscribe(result =>{
      this.alerts = result.alerts;
      console.log(this.alerts);
    },err => {

    });

    this.bookService.getPages(this.readCurrentPage, this.readPageSize, this.isReadingCurrentPage, this.isReadingPageSize,this.toReadCurrentPage
      ,this.toReadPageSize, this.user?._id)
      .subscribe(result => {
        this.toReadTotal = result.toReadCount;
        this.toRead= result.toRead;

        console.log(this.toReadTotal);

        this.readTotal = result.readCount;
        this.read = result.read;

        this.isReadingTotal = result.isReadingCount;
        this.isReading = result.isReading;
      }, err => {

      });
      this.bookService.getCommentsRegFront(this.user._id).subscribe(result => {
        this.comments = result.comments;
      }, err => {
        this.comments = [];
      });
      this.bookService.getByGenres().subscribe(result => {
        let chart = new CanvasJS.Chart("chartContainer", {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: true,
          title:{
            text: "Po žanrovima"
          },
          data: [{
            type: "pie",
            showInLegend: true,
            toolTipContent: "<b>{name}</b>: ${y} (#percent%)",
            indexLabel: "{name} - #percent%",
            dataPoints: result.data
          }]
        });
          
        chart.render();
      })
      
  }

  konvertujDatum(d: Date): string {
    return d ? d.toString().substr(0, 10) : null;
  }

  izmjeni() {
    if (!this.change) {
      this.form = new FormGroup({
        'name': new FormControl(this.user.name, { validators: Validators.required }),
        'lastName': new FormControl(this.user.lastname, { validators: Validators.required }),
        'username': new FormControl(this.user.username, { validators: Validators.required }),
        'date': new FormControl(this.user.date.toString().substr(0,10), { validators: Validators.required }),
        'city': new FormControl(this.user.city, { validators: Validators.required }),
        'country': new FormControl(this.user.country, { validators: Validators.required }),
        'email': new FormControl(this.user.email, { validators: Validators.required }),
        'image': new FormControl(this.user.imagePath, null)
      });
      this.change = true;
    }
    else{
      this.change = false;
    }
  }

  imagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
  }

  save(){
    this.authService.updateUser(this.user._id,this.form.value.name, this.form.value.lastName,this.form.value.username, this.form.value.date, this.form.value.city, this.form.value.country, this.form.value.email, this.form.value.image)
    .subscribe(result => {
      this.user = result.user;
      this.authService.setUser(this.user);
      this.change = false;
    }, err => {
      this.message = err.message.email == undefined || err.message.email == null? 'Email je vec zauzet' : 'Korisnicko ime je vec zauzeto';
    })
  }

  ukloni(b: Book){
    this.bookService.ukloni(this.user, b).subscribe(result => {
      this.bookService.getPages(this.readCurrentPage, this.readPageSize, this.isReadingCurrentPage, this.isReadingPageSize,this.toReadCurrentPage
        ,this.toReadPageSize, this.user._id)
        .subscribe(result => {
          this.toReadTotal = result.toReadCount;
          this.toRead= result.toRead;
        }, err => {
  
        })
    }, err => {

    });
  }

  onChangedPageR(data: PageEvent){
    this.readPageSize = data.pageSize;
    this.readCurrentPage = data.pageIndex + 1;
    this.bookService.getPages(this.readCurrentPage, this.readPageSize, this.isReadingCurrentPage, this.isReadingPageSize,this.toReadCurrentPage
      ,this.toReadPageSize, this.user._id)
      .subscribe(result => {
        this.readTotal = result.readCount;
        this.read = result.read;
      }, err => {

      })
  }

  onChangedPageIR(data: PageEvent){
    this.isReadingPageSize = data.pageSize;
    this.isReadingCurrentPage = data.pageIndex + 1;
    this.bookService.getPages(this.readCurrentPage, this.readPageSize, this.isReadingCurrentPage, this.isReadingPageSize,this.toReadCurrentPage
      ,this.toReadPageSize, this.user._id)
      .subscribe(result => {
        this.isReadingTotal = result.isReadingCount;
        this.isReading = result.isReading;
      }, err => {

      })
  }

  onChangedPageTR(data: PageEvent){
    this.toReadPageSize = data.pageSize;
    this.toReadCurrentPage = data.pageIndex + 1;
    this.bookService.getPages(this.readCurrentPage, this.readPageSize, this.isReadingCurrentPage, this.isReadingPageSize,this.toReadCurrentPage
      ,this.toReadPageSize, this.user._id)
      .subscribe(result => {
        this.toReadTotal = result.toReadCount;
        this.toRead= result.toRead;
      }, err => {

      })
  }

  search(form: NgForm){//dodati nakon dodavanja registrovanog korisnika
    this.bookService.searchBooks(form.value.title, form.value.author, form.value.genre);
    this.searched = true;
    console.log(form.value.author);
  }


  ispisiZanr(zanr: Genre[]):string{
    let s : string = "";
    zanr.forEach(zanr => {
      s = s.concat(zanr.name + ', ')
    });
    return s.substr(0, s.length - 2);
  }

  searchUsers(form: NgForm){
    this.bookService.searchUsers(form.value.name, form.value.lastname, form.value.username, form.value.email)
    .subscribe(result => {
      this.searchedUsers = result.users;
    },err => {
      this.searchedUsers = [];
    })
  }

  ngOnDestroy(): void {
    this.genresSub.unsubscribe();
    this.booksSub.unsubscribe();
  }
}

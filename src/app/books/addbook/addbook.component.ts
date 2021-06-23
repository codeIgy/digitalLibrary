import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from '../book.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Genre } from '../model/genre';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-addbook',
  templateUrl: './addbook.component.html',
  styleUrls: ['./addbook.component.css']
})
export class AddbookComponent implements OnInit, OnDestroy {

  form: FormGroup;
  genres: Genre[];
  genresSub: Subscription;

  messageSub: Subscription;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.updateGenres();
    this.genres = this.bookService.getGenres();
    this.genresSub = this.bookService.getGenresListener().subscribe(result =>{
      this.genres = result;
    })
    this.messageSub = this.bookService.getAddBookListener().subscribe(result => {
      alert(result);
    })
    this.form = new FormGroup({
      'image': new FormControl(null,null),
      'title': new FormControl(null, {validators: Validators.required}),
      'author': new FormControl(null, {validators: Validators.required}),
      'issueDate': new FormControl(null, {validators: Validators.required}),
      'genre': new FormControl(null, {validators: [Validators.required, Validators.maxLength(3)]}),
      'description': new FormControl(null, null)
    })
  }

  add(){
    if(this.form.invalid){
      return;
    }
    this.bookService.addBook(this.form.value.title,this.form.value.image, this.form.value.author, this.form.value.issueDate, this.form.value.genre,
      this.form.value.description);
  }

  imagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
  }

  ngOnDestroy(){
    this.genresSub.unsubscribe();
  }
}

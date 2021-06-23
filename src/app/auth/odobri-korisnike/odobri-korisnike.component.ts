import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/books/book.service';
import { AuthService } from '../auth.service';
import { User } from '../signup/user.model';

@Component({
  selector: 'app-odobri-korisnike',
  templateUrl: './odobri-korisnike.component.html',
  styleUrls: ['./odobri-korisnike.component.css']
})
export class OdobriKorisnikeComponent implements OnInit {

  users: User[] = [];
  columndefs3: any[] = ['ime', 'prezime', 'username', 'email', 'akcija'];

  constructor(private authService: AuthService, private bookService: BookService) { }

  ngOnInit(): void {
    this.bookService.searchUsers('', '', '', '').subscribe(result => {
      this.users = result.users.filter(p => p.odobren == false);
    },err => {
      this.users = [];
    });
  }

  odobriKorisnika(user_id: string){
    this.authService.odobriKorisnika(user_id).subscribe(result => {
      this.users = this.users.filter(p => p._id != user_id);
    },err => {

    });
  }
  
  neOdobriKorisnika(user_id: string){
    this.authService.neOdobriKorisnika(user_id).subscribe(result => {
      this.users = this.users.filter(p => p._id != user_id);
    },err => {

    });
  }

}

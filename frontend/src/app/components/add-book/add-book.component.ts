import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { v4 as uuidv4 } from 'uuid';
import { HelperService } from '../../services/helper.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  @ViewChild('bookForm', { static: false }) bookForm?: NgForm;

  currentUser: User | null = null;

  input = {
      title: '',
      author: '',
      genre: '',
      year: null,
      comment: null
  }

  constructor(private bookService: BookService,
              private datePipe: DatePipe,
              private helperService: HelperService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if(!this.currentUser || this.currentUser.role === 'Reader') {
      this.router.navigateByUrl('/');
    }
  }

  submitForm() {
    if(this.bookForm!.valid) {
      const newBook: Book = {
        id: uuidv4(),
        title: this.input.title,
        author: this.input.author,
        genre: this.input.genre,
        year: this.input.year!,
        added: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
        checkOutCount: 0,
        status: "AVAILABLE",
        comment: this.input.comment!
      }
      this.bookService.saveBook(newBook).subscribe(resp => {
        this.resetForm();
        this.helperService.openSnackBar("Book successfully added to the library!");
      });
    }
  }

  resetForm() {
    this.input = {
      title: '',
      author: '',
      genre: '',
      year: null,
      comment: null,
    };
    this.bookForm!.resetForm();
  }
}


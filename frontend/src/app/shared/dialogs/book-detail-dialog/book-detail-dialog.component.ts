import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Book } from '../../../models/book';
import { BookService } from '../../../services/book.service';
import { CheckoutService } from '../../../services/checkout.service';
import { Checkout } from '../../../models/checkout';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-book-detail-dialog',
  templateUrl: './book-detail-dialog.component.html',
  styleUrls: ['./book-detail-dialog.component.css']
})
export class BookDetailDialogComponent implements OnInit{
  @ViewChild('checkoutForm', { static: false }) checkoutForm?: NgForm;
  @ViewChild('editForm', { static: false }) editForm?: NgForm;

  currentUser: User | null = null;
  minDate: Date = new Date();
  maxDate: Date = new Date();

  firstName: string = "";
  lastName: string = "";
  dueDate: Date = new Date();

  constructor(public dialogRef: MatDialogRef<BookDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {book: Book, isEdit: boolean},
              private dateAdapter: DateAdapter<Date>,
              private datePipe: DatePipe,
              private bookService: BookService,
              private checkoutService: CheckoutService,
              private userService: UserService) { }


  ngOnInit(): void {
    this.setBoundaryDates(); // setting minimum and maximum dates for the date picker
    this.dueDate = this.dateAdapter.addCalendarDays(this.dueDate, 1); // setting the dueDate default value to the minimum date
    this.currentUser = this.userService.getCurrentUser();
    if(this.currentUser!.role === "Reader") { // set default values to the user name if they're logged in
      this.firstName = this.currentUser!.firstName;
      this.lastName = this.currentUser!.lastName;
    }
  }

  submitForm(isEdit: boolean): void {
    if(isEdit) { // if the form being submitted is an edit form
      if(this.editForm!.valid) {
        this.bookService.saveBook(this.data.book).subscribe();
        this.editFavouriteBooksFromAccount(this.data.book);
        this.editBookRelatedCheckoutsFromAccounts(this.data.book);
        this.closeDialog(true);
      }
    } else { // if it is a checkout form
      if(this.checkoutForm!.valid || this.currentUser!.role === "Reader") {
        this.addCheckout();
        this.updateBookStatus();
        this.closeDialog(true);
      }
    }
  }

  // adds all the information to a new Checkout object, then sends it as the body for a POST request, also updates the book's data
  addCheckout(): void {
    this.data.book.status = "BORROWED";
    this.data.book.dueDate = this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')!;
    this.data.book.checkOutCount += 1;

    const resultCheckout: Checkout = {
      id: uuidv4(),
      borrowerFirstName: this.firstName,
      borrowerLastName: this.lastName,
      borrowedBook: this.data.book,
      checkedOutDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      dueDate: this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')!,
    }
    this.checkoutService.saveCheckout(resultCheckout).subscribe();
    if(this.currentUser) {
      this.currentUser.checkouts! ? this.currentUser.checkouts.push(resultCheckout) : this.currentUser.checkouts = [resultCheckout];
      this.userService.updateCurrentUserData(this.currentUser);
    }
  }

  // edits the favourite books info from all accounts
  editFavouriteBooksFromAccount(book: Book): void {
    const users = this.userService.getUserData();
    if (this.currentUser!.favouriteBooks) {
      this.currentUser!.favouriteBooks = this.currentUser!.favouriteBooks!.map(favouriteBook => {
        if (favouriteBook.id === book.id) {
          return book;
        }
        return favouriteBook;
      });
    }
    users.allUsers.forEach(user => {
      if (user.favouriteBooks) {
        user.favouriteBooks = user.favouriteBooks.map(favouriteBook => {
          if (favouriteBook.id === book.id) {
            return book;
          }
          return favouriteBook;
        });
      }
    });
    this.userService.setUserData({ currentUser: this.currentUser, allUsers: users.allUsers });
  }

  // edits the favourite books related checkouts' info from all accounts
  editBookRelatedCheckoutsFromAccounts(book: Book): void {
    const users = this.userService.getUserData();
    if (this.currentUser!.checkouts) {
      this.currentUser!.checkouts = this.currentUser!.checkouts!.map(userCheckout => {
        if (userCheckout.borrowedBook.id === book.id) {
          return { ...userCheckout, borrowedBook: book };
        }
        return userCheckout;
      });
    }
    users.allUsers.forEach(user => {
      if (user.checkouts) {
        user.checkouts = user.checkouts.map(userCheckout => {
          if (userCheckout.borrowedBook.id === book.id) {
            return { ...userCheckout, borrowedBook: book };
          }
          return userCheckout;
        });
      }
    });
    this.userService.setUserData({ currentUser: this.currentUser, allUsers: users.allUsers });
  }


  // updates the status of the book from "AVAILABLE" to "BORROWED", also adds the due date to the table
  updateBookStatus(): void {
    const formattedDate = this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')!;
    this.data.book.dueDate = formattedDate;
    this.bookService.saveBook(this.data.book).subscribe()
  }

  closeDialog(confirmed: boolean): void {
    this.dialogRef.close(confirmed);
  }

  setBoundaryDates() {
    const currentDate = new Date();
    this.maxDate = this.dateAdapter.addCalendarYears(currentDate, 1);
    this.minDate = this.dateAdapter.addCalendarDays(currentDate, 1);
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Book } from '../../../models/book';
import { BookService } from '../../../services/book.service';
import { CheckoutService } from '../../../services/checkout.service';
import { Checkout } from '../../../models/checkout';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-book-detail-dialog',
  templateUrl: './book-detail-dialog.component.html',
  styleUrls: ['./book-detail-dialog.component.css']
})
export class BookDetailDialogComponent implements OnInit{
  minDate: Date = new Date();
  maxDate: Date = new Date();

  firstName: string = "";
  lastName: string = "";
  dueDate: string = "";

  constructor(public dialogRef: MatDialogRef<BookDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Book,
              private dateAdapter: DateAdapter<Date>,
              private datePipe: DatePipe,
              private bookService: BookService,
              private checkoutService: CheckoutService) { }


  ngOnInit(): void {
    this.setMaxDate(); // setting minimum and maximum dates for the date picker
    this.setMinDate();
  }

  submitForm(): void {
    this.addCheckout();
    this.updateBookStatus();
    this.closeDialog();
  }

  // adds all the information to a new Checkout interface, then sends it as the body for a POST request
  addCheckout(): void {
    this.data.status = "BORROWED";
    const resultCheckout: Checkout = {
      id: uuidv4(),
      borrowerFirstName: this.firstName,
      borrowerLastName: this.lastName,
      borrowedBook: this.data,
      checkedOutDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      dueDate: this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')!,
      returnedDate: null
    }
    this.checkoutService.saveCheckout(resultCheckout).subscribe();
  }

  // updates the status of the book from "AVAILABLE" to "BORROWED", also adds the due date to the table
  updateBookStatus(): void {
      const formattedDate = this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')!;
      this.bookService.updateBookStatus(this.data.id, "BORROWED", formattedDate).subscribe();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  setMaxDate() {
    const currentDate = new Date();
    this.maxDate = this.dateAdapter.addCalendarYears(currentDate, 1);
  }

  setMinDate() {
    const currentDate = new Date();
    this.minDate = this.dateAdapter.addCalendarDays(currentDate, 1);
  }
}

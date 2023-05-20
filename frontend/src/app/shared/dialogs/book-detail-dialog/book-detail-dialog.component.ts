import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { NgForm } from '@angular/forms';
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
  @ViewChild('checkoutForm', { static: false }) checkoutForm?: NgForm;

  minDate: Date = new Date();
  maxDate: Date = new Date();

  firstName: string = "";
  lastName: string = "";
  dueDate: Date = new Date();

  constructor(public dialogRef: MatDialogRef<BookDetailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Book,
              private dateAdapter: DateAdapter<Date>,
              private datePipe: DatePipe,
              private bookService: BookService,
              private checkoutService: CheckoutService) { }


  ngOnInit(): void {
    this.setBoundaryDates(); // setting minimum and maximum dates for the date picker
    this.dueDate = this.dateAdapter.addCalendarDays(this.dueDate, 1); // setting the dueDate default value to the minimum date
  }

  submitForm(): void {
    if(this.checkoutForm!.valid) {
      this.addCheckout();
      this.updateBookStatus();
      this.closeDialog(true);
    }
  }

  // adds all the information to a new Checkout object, then sends it as the body for a POST request, also updates the book's data
  addCheckout(): void {
    this.data.status = "BORROWED";
    this.data.dueDate = this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')!;
    this.data.checkOutCount += 1;

    const resultCheckout: Checkout = {
      id: uuidv4(),
      borrowerFirstName: this.firstName,
      borrowerLastName: this.lastName,
      borrowedBook: this.data,
      checkedOutDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd')!,
      dueDate: this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')!,
    }
    this.checkoutService.saveCheckout(resultCheckout).subscribe();
  }

  // updates the status of the book from "AVAILABLE" to "BORROWED", also adds the due date to the table
  updateBookStatus(): void {
    const formattedDate = this.datePipe.transform(this.dueDate, 'yyyy-MM-dd')!;
    this.bookService.updateBookStatus(this.data.id, "BORROWED", formattedDate).subscribe();
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

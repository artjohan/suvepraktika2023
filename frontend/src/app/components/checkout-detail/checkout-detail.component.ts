import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CheckoutService } from '../../services/checkout.service';
import { BookService } from '../../services/book.service';
import { Checkout } from '../../models/checkout';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.css']
})
export class CheckoutDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private bookService: BookService,
    private datePipe: DatePipe,
  ) {}

  checkout$!: Observable<Checkout>;
  status: string = "";
  statusColor: string = "green";

  ngOnInit(): void {
    this.checkout$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.checkoutService.getCheckout(id)),
      tap(checkout => {
        this.setStatus(checkout);
      })
    );
  }

  removeCheckout(checkout: Checkout): void {
    this.checkoutService.deleteCheckout(checkout.id).subscribe();
  }

  // sets the status of the checkout by comparing dates
  setStatus(checkout: Checkout): void {
    if(checkout.returnedDate) {
      this.status = `RETURNED ON ${checkout.returnedDate}`;
    } else {
      const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
      if(formattedDate > checkout.dueDate) {
        this.status = `${this.calculateDayDifference(formattedDate, checkout.dueDate)} DAYS OVERDUE`;
        this.statusColor = "red";
      } else {
        this.status = `BORROWED WITH ${this.calculateDayDifference(checkout.dueDate, formattedDate)} DAYS LEFT`;
        this.statusColor = "orange";
      }
    }
  }

  // calculates how many days are between 2 dates
  calculateDayDifference(startDateStr: string, endDateStr: string): number {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const difference = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  // function for returning book, also updates returnedDate to the current day and makes the book available for borrowing again
  returnBook(checkout: Checkout): void {
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.checkoutService.updateReturnedDate(checkout.id, formattedDate).subscribe();
    this.bookService.updateBookStatus(checkout.borrowedBook.id, "AVAILABLE", "").subscribe();
  }
}

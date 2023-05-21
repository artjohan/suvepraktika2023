import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CheckoutService } from '../../services/checkout.service';
import { BookService } from '../../services/book.service';
import { Checkout } from '../../models/checkout';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component'
import { HelperService } from '../../services/helper.service';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

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
    private dialog: MatDialog,
    private helperService: HelperService,
    private userService: UserService
  ) {}

  checkout$!: Observable<Checkout>;
  currentUser: User | null = null;
  isUserCheckout: boolean = false;
  status: string = "";
  statusColor: string = "green";

  ngOnInit(): void {
    this.checkout$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.checkoutService.getCheckout(id)),
      tap(checkout => {
        this.setStatus(checkout);
        this.isUserCheckout = this.checkUserCheckout(checkout);
      })
    );

    this.currentUser = this.userService.getCurrentUser();
  }

  removeCheckout(checkout: Checkout): void {
    this.checkoutService.deleteCheckout(checkout.id).subscribe();
    this.removeCheckoutFromAccounts(checkout);
  }

  removeCheckoutFromAccounts(checkout: Checkout): void {
    const users = this.userService.getUserData();

    // removes checkout from the current user's information if it exists
    if(this.currentUser!.checkouts) {
       this.currentUser!.checkouts = this.currentUser!.checkouts!.filter(userCheckout => userCheckout.id !== checkout.id);
    }
    // removes checkout from all the users informations if it exists
    users.allUsers.forEach((user) => {
      if(user.checkouts) {
        user.checkouts = user.checkouts.filter((userCheckout) => userCheckout.id !== checkout.id);
      }
    })
    this.userService.setUserData({ currentUser: this.currentUser, allUsers: users.allUsers });
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

  checkUserCheckout(checkout: Checkout): boolean {
    if(this.currentUser?.checkouts) {
      return this.currentUser.checkouts.find(userCheckout => userCheckout.id === checkout.id) ? true : false
    }
    return false;
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
    checkout.borrowedBook.status = "AVAILABLE";
    checkout.returnedDate! = formattedDate;
    this.checkoutService.saveCheckout(checkout).subscribe();
    this.bookService.saveBook(checkout.borrowedBook).subscribe()
  }

  // opens a dialog asking for confirmation for removing checkout
  openRemoveDialog(checkout: Checkout): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '400px',
          data: "Are you sure you want to remove this checkout from the checkouts history?",
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.removeCheckout(checkout);
        window.location.href = '/checkouts'
      }
    });
  }

  // opens a dialog asking for confirmation on returning book
  openReturnDialog(checkout: Checkout): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '400px',
          data: "Are you sure you want to return this book?",
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.returnBook(checkout);
        this.status = `RETURNED ON ${this.datePipe.transform(new Date(), 'yyyy-MM-dd')!}`;
        this.statusColor = "green";
        this.helperService.openSnackBar("Book successfully returned!");
      }
    });
  }
}

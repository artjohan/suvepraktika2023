import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookService } from '../../services/book.service';
import { CheckoutService } from '../../services/checkout.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailDialogComponent } from '../../shared/dialogs/book-detail-dialog/book-detail-dialog.component'

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private checkoutService: CheckoutService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  book$!: Observable<Book>

  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

  // deletes book from database, first removing all instances of the book from the checkouts table, then removing it entirely
  removeBook(book: Book): void {
    this.checkoutService.deleteCheckoutsByBookId(book.id)
        .pipe(
         switchMap(() => this.bookService.deleteBook(book.id))).subscribe();
  }

  // opens a dialog box asking for additional checkout information
  openCheckoutDialog(book: Book): void {
    const dialogRef = this.dialog.open(BookDetailDialogComponent, {
          width: '400px',
          data: book,
        });

        dialogRef.afterClosed().subscribe(result => {
          // Handle dialog close event if needed
        });
      }

}

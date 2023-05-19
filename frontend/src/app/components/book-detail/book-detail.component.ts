import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookService } from '../../services/book.service';
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
  book$!: Observable<Book>
  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

  // deletes book from database
  removeBook(bookId: string): void {
    this.bookService.deleteBook(bookId).subscribe();
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

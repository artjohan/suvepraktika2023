import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

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
  ) { }

  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

  removeBook(bookId: string): void {
    this.bookService.deleteBook(bookId).subscribe();
  }

  updateBookStatus(book: Book): void {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 3);
    const formattedDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd')!;

    this.bookService.updateBookStatus(book.id, "BORROWED", formattedDate).subscribe();
  }

}

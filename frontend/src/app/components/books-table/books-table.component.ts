import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';
import { MatTableDataSource } from '@angular/material/table'

@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.css']
})
export class BooksTableComponent implements OnInit {

  constructor(private bookService: BookService) {

  }

  books$!: Observable<Page<Book>>;
  dataSource = new MatTableDataSource<Book>()
  columnHeaders: string[] = ['title', 'author', 'year', 'genre']

  // making the dataSource an array of the book objects to populate the mat table
  ngOnInit(): void {
    this.books$ = this.bookService.getBooks({})
    this.books$.subscribe(books => {
      this.dataSource = new MatTableDataSource<Book>(books.content)
    })
  }
}

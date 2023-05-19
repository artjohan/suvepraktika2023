import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page, PageRequest } from '../../models/page';
import { Book } from '../../models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.css']
})
export class BooksTableComponent implements OnInit {

  constructor(private bookService: BookService) { }

  pageInfo: PageRequest = {
    pageIndex: 0,
    pageSize: 20,
    sort: '',
    direction: '',
    searchTerm: ''
  }

  allBooks$!: Observable<Page<Book>>;
  booksLength?: number;
  dataSource = new MatTableDataSource<Book>();
  columnHeaders: string[] = ['title', 'author', 'year', 'genre', 'status'];

  // making the dataSource an array of the book objects to populate the mat table
  ngOnInit(): void {
    this.bookService.getBooks(this.pageInfo).subscribe(books => {
        this.dataSource.data = books.content;
        this.booksLength = books.totalElements;
        this.allBooks$ = this.bookService.getBooks({pageIndex: 0, pageSize: this.booksLength});
    })
  }

  // pagination using the api, changing page index and size to the paginator values
  pagination(event:PageEvent): void {
    this.pageInfo.pageIndex = event.pageIndex;
    this.pageInfo.pageSize = event.pageSize;
    this.updateTable();
  }

  // sorting using the api, changing page sort and direction to the sorter values
  sortTable(event:Sort): void {
    this.pageInfo.sort = event.active;
    this.pageInfo.direction = event.direction;
    this.updateTable();
  }

  // updates the table by updating the dataSource according to the pageInfo criteria
  updateTable(): void {
    this.bookService.getBooks(this.pageInfo).subscribe(books => {
      this.dataSource.data = books.content;
      this.booksLength = books.totalElements;
    })
  }
}

import { Component } from '@angular/core';
import { BooksTableComponent } from '../books-table/books-table.component';
import { Book } from '../../models/book';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent{

  searchValue: string = "";

  constructor(private booksTableComponent: BooksTableComponent) { }

  search(): void {
    this.booksTableComponent.pageInfo.searchTerm = this.searchValue;
    this.booksTableComponent.updateTable();
  }
}

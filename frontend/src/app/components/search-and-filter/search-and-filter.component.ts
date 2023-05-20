import { Component, Input, Optional } from '@angular/core';
import { BooksTableComponent } from '../books-table/books-table.component';
import { CheckoutsTableComponent } from '../checkouts-table/checkouts-table.component';
import { Book } from '../../models/book';

@Component({
  selector: 'app-search-and-filter',
  templateUrl: './search-and-filter.component.html',
  styleUrls: ['./search-and-filter.component.css']
})

export class SearchAndFilterComponent{

  constructor(@Optional() private booksTableComponent: BooksTableComponent,
              @Optional() private checkoutsTableComponent: CheckoutsTableComponent) { }

  @Input() searchType: string = "";
  searchValue: string = "";
  selectedStatus?: string;
  hint?: string;

  bookStatuses: string[] = ["AVAILABLE", "BORROWED", "RETURNED", "DAMAGED", "PROCESSING"];
  checkoutStatuses: string[] = ["RETURNED", "BORROWED", "OVERDUE"];

  // calls the methods of each respective class with the searchValue
  search(): void {
    if(this.searchType === "books") {
      this.booksTableComponent.searchBooks(this.searchValue);
    }
    if(this.searchType === "checkouts") {
      this.checkoutsTableComponent.searchCheckouts(this.searchValue);
    }
  }

  // calls the methods of each respective class with the selectValue
  optionSelectChange(event: any): void {
    if(this.searchType === "books") {
      this.booksTableComponent.filterBooksByStatus(event.value);
    }
    if(this.searchType === "checkouts") {
      this.checkoutsTableComponent.filterCheckoutsByStatus(event.value);
    }
  }
}

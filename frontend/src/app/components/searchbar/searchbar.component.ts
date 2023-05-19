import { Component, Input, Optional } from '@angular/core';
import { BooksTableComponent } from '../books-table/books-table.component';
import { CheckoutsTableComponent } from '../checkouts-table/checkouts-table.component';
import { Book } from '../../models/book';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
// TODO rename this component to more accurately represent what it does (search + filter)
export class SearchbarComponent{

  @Input() searchType: string = ""
  searchValue: string = "";

  constructor(@Optional() private booksTableComponent: BooksTableComponent, @Optional() private checkoutsTableComponent: CheckoutsTableComponent) { }

  // calls the methods of each respective class with the searchValue
  search(): void {
    if(this.searchType === "books") {
      this.booksTableComponent.searchBooks(this.searchValue);
    } else if(this.searchType === "checkouts") {
      this.checkoutsTableComponent.searchCheckouts(this.searchValue);
    }
  }
  // calls the methods of each respective class with the selectValue
  optionSelectChange(event: any): void {
    if(this.searchType === "books") {
      this.booksTableComponent.filterBooksByStatus(event.value);
    } else if(this.searchType === "checkouts") {
      // TODO add filtering system for checkout status (returned, overdue, borrowed)
    }
  }
}

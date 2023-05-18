import { Component, Input, Optional } from '@angular/core';
import { BooksTableComponent } from '../books-table/books-table.component';
import { CheckoutsTableComponent } from '../checkouts-table/checkouts-table.component';
import { Book } from '../../models/book';
import { Checkout } from '../../models/checkout';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent{

  @Input() allBooks?: Book[];
  @Input() allCheckouts?: Checkout[];
  searchValue: string = "";

  constructor(@Optional() private booksTableComponent: BooksTableComponent, @Optional() private checkoutsTableComponent: CheckoutsTableComponent) { }

  search(): void {
    if(this.allBooks) {
        const filteredData = this.allBooks.filter(book => book.title.toLowerCase().includes(this.searchValue.toLowerCase()));
        console.log(filteredData);
    } else if(this.allCheckouts) {
        const filteredData = this.allCheckouts.filter(checkout => checkout.borrowedBook.title.toLowerCase().includes(this.searchValue.toLowerCase()));
        console.log(filteredData);
    }
  }
}

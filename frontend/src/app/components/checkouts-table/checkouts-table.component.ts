import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { Observable } from 'rxjs';
import { Page, PageRequest } from '../../models/page';
import { Checkout } from '../../models/checkout';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-checkouts-table',
  templateUrl: './checkouts-table.component.html',
  styleUrls: ['./checkouts-table.component.css']
})
export class CheckoutsTableComponent implements OnInit {

  constructor(private checkoutService: CheckoutService) { }

  pageInfo: PageRequest = {
      pageIndex: 0,
      pageSize: 20,
      sort: '',
      direction: '',
      searchTerm: '',
  }

  checkouts$!: Observable<Page<Checkout>>;
  checkoutsLength?: number;
  dataSource = new MatTableDataSource<Checkout>();
  columnHeaders: string[] = ['borrowedBookTitle', 'borrowerFirstName', 'borrowerLastName', 'checkedOutDate', 'dueDate'];

  // making the dataSource an array of the checkout objects to populate the mat table
  ngOnInit(): void {
    this.checkoutService.getCheckouts(this.pageInfo).subscribe(checkouts => {
        this.dataSource.data = checkouts.content;
        this.checkoutsLength = checkouts.totalElements;
        this.checkouts$ = this.checkoutService.getCheckouts(this.pageInfo);
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
    this.checkoutService.getCheckouts(this.pageInfo).subscribe(checkouts => {
      this.dataSource.data = checkouts.content;
      this.checkoutsLength = checkouts.totalElements;
    })
  }

  searchCheckouts(searchValue: string): void {
    this.pageInfo.searchTerm = searchValue;
    this.updateTable();
  }

  filterCheckoutsByStatus(status: string): void {
    this.pageInfo.status = status;
    this.updateTable();
  }
}

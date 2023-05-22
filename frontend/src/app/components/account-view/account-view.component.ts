import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HelperService } from '../../services/helper.service';
import { User } from '../../models/user';
import { Book } from '../../models/book';
import { Checkout } from '../../models/checkout';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css']
})
export class AccountViewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  currentUser: User | null = null;
  bookColumnHeaders: string[] = ['title', 'author', 'year', 'genre', 'status'];
  checkoutColumnHeaders: string[] = ['borrowedBookTitle', 'borrowerFirstName', 'borrowerLastName', 'checkedOutDate', 'dueDate'];
  bookDataSource = new MatTableDataSource<Book>();
  checkoutDataSource = new MatTableDataSource<Checkout>();

  constructor(private userService: UserService,
              private helperService: HelperService,
              private router: Router,
              private location: Location) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    if (!this.currentUser) {
      // redirect if not logged in
      this.router.navigateByUrl('/login');
    } else {
      this.bookDataSource.data = this.currentUser.favouriteBooks || [];
      this.checkoutDataSource.data = this.currentUser.checkouts || [];
      this.bookDataSource.paginator = this.paginator!;
      this.checkoutDataSource.paginator = this.paginator!;
    }
  }

  // handles different pagination
  onBooksPageChange(event: PageEvent): void {
    this.paginator!.pageIndex = event.pageIndex;
    this.paginator!.pageSize = event.pageSize;
    this.bookDataSource.data = this.getPagedBooks();
  }

  onCheckoutsPageChange(event: PageEvent): void {
    this.paginator!.pageIndex = event.pageIndex;
    this.paginator!.pageSize = event.pageSize;
    this.checkoutDataSource.data = this.getPagedCheckouts();
  }

  getPagedBooks(): Book[] {
    const startIndex = this.paginator!.pageIndex * this.paginator!.pageSize;
    const endIndex = startIndex + this.paginator!.pageSize;
    return this.currentUser?.favouriteBooks?.slice(startIndex, endIndex) || [];
  }

  getPagedCheckouts(): Checkout[] {
    const startIndex = this.paginator!.pageIndex * this.paginator!.pageSize;
    const endIndex = startIndex + this.paginator!.pageSize;
    return this.currentUser?.checkouts?.slice(startIndex, endIndex) || [];
  }
}

import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BookService } from '../../services/book.service';
import { CheckoutService } from '../../services/checkout.service';
import { Book } from '../../models/book';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailDialogComponent } from '../../shared/dialogs/book-detail-dialog/book-detail-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { HelperService } from '../../services/helper.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private checkoutService: CheckoutService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router,
    private helperService: HelperService,
    private userService: UserService
  ) { }

  book$!: Observable<Book>
  currentUser: User | null = null;
  favMsg: string = ""

  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)))

    this.currentUser = this.userService.getCurrentUser();

    this.book$.subscribe(book => {
      if(this.isFavourite(book)) {
        this.favMsg = "UNFAVOURITE";
      } else {
        this.favMsg = "FAVOURITE";
      }
    })
  }

  // deletes book from database, first removing all instances of the book from the checkouts table, then removing it entirely
  removeBook(book: Book): void {
    this.checkoutService.deleteCheckoutsByBookId(book.id)
      .pipe(
       switchMap(() => this.bookService.deleteBook(book.id))).subscribe();
  }

  // adds/removes book from favourites
  favouriteToggle(book: Book): void {
    if(this.favMsg === "FAVOURITE") {
      this.favMsg = "UNFAVOURITE"
      if(this.currentUser!.favouriteBooks) {
        this.currentUser!.favouriteBooks.push(book);
      } else {
        this.currentUser!.favouriteBooks = [book]
      }
      this.helperService.openSnackBar("Book added to favourites!");
    } else {
      this.favMsg = "FAVOURITE"
      this.currentUser!.favouriteBooks = this.currentUser!.favouriteBooks!.filter(searchBook => searchBook.id !== book.id)
      this.helperService.openSnackBar("Book removed from favourites!");
    }
    this.userService.updateCurrentUserData(this.currentUser);
  }

  isFavourite(book: Book): boolean {
    if(this.currentUser?.favouriteBooks) {
      return this.currentUser.favouriteBooks.find(searchBook => searchBook.id === book.id) ? true : false
    }
    return false;
  }

  // opens a dialog box asking for additional checkout information
  openCheckoutDialog(book: Book): void {
    const dialogRef = this.dialog.open(BookDetailDialogComponent, {
          width: '400px',
          data: book,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.helperService.openSnackBar("Book successfully checked out!");
      }
    });
  }

  // opens a dialog asking for confirmation on removing book
  openRemoveDialog(book: Book): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '400px',
          data: "Are you sure you want to remove this book from the library?",
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.removeBook(book);
        this.helperService.openSnackBar("Book successfully removed!");
        this.router.navigateByUrl('/books');
      }
    });
  }
}

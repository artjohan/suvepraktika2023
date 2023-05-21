import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { BooksTableComponent } from './components/books-table/books-table.component';
import { CheckoutsTableComponent } from './components/checkouts-table/checkouts-table.component';
import { CheckoutDetailComponent } from './components/checkout-detail/checkout-detail.component';
import { SearchAndFilterComponent } from './components/search-and-filter/search-and-filter.component';
import { BookDetailDialogComponent } from './shared/dialogs/book-detail-dialog/book-detail-dialog.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { ConfirmationDialogComponent } from './shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';

@NgModule({
  declarations: [
    AppComponent,
    BookDetailComponent,
    BooksTableComponent,
    CheckoutsTableComponent,
    CheckoutDetailComponent,
    SearchAndFilterComponent,
    BookDetailDialogComponent,
    AddBookComponent,
    ConfirmationDialogComponent,
    RegisterFormComponent,
    LoginFormComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { BookDetailDialogComponent } from './shared/dialogs/book-detail-dialog/book-detail-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BookDetailComponent,
    BooksTableComponent,
    CheckoutsTableComponent,
    CheckoutDetailComponent,
    SearchbarComponent,
    BookDetailDialogComponent,
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
    MatNativeDateModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

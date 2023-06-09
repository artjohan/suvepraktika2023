import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BooksTableComponent } from './components/books-table/books-table.component';
import { CheckoutsTableComponent } from './components/checkouts-table/checkouts-table.component';
import { CheckoutDetailComponent } from './components/checkout-detail/checkout-detail.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AccountViewComponent } from './components/account-view/account-view.component';

const routes: Routes = [
  {path: '', redirectTo: 'books', pathMatch: 'full'},
  {path: 'books', component: BooksTableComponent},
  {path: 'books/:id', component: BookDetailComponent},
  {path: 'checkouts', component: CheckoutsTableComponent},
  {path: 'checkouts/:id', component: CheckoutDetailComponent},
  {path: 'add-book', component: AddBookComponent},
  {path: 'register', component: RegisterFormComponent},
  {path: 'login', component: LoginFormComponent},
  {path: 'account', component: AccountViewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

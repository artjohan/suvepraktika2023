import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page, PageRequest } from '../models/page';
import { Book } from '../models/book';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestUtil } from './rest-util';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly baseUrl = environment.backendUrl + '/api/book';

  constructor(
    private http: HttpClient,
  ) {
  }

  getBooks(filter: Partial<PageRequest>): Observable<Page<Book>> {
    const url = this.baseUrl + '/books';
    const params = RestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<Page<Book>>(url, {params});
  }

  getBook(bookId: string): Observable<Book> {
    const url = this.baseUrl + '/book';
    const params = new HttpParams().set('id', bookId);
    return this.http.get<Book>(url, {params});
  }

  saveBook(book: Book): Observable<void> {
    const url = this.baseUrl + '/book';
    return this.http.post<void>(url, book);
  }

  deleteBook(bookId: string): Observable<void> {
    const url = this.baseUrl + '/book';
    const params = new HttpParams().set('id', bookId);
    return this.http.delete<void>(url, {params});
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page, PageRequest } from '../models/page';
import { Checkout } from '../models/checkout';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestUtil } from './rest-util';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private readonly baseUrl = environment.backendUrl + '/api/checkout';

  constructor(
    private http: HttpClient,
  ) {
  }

  getCheckouts(filter: Partial<PageRequest>): Observable<Page<Checkout>> {
    const url = this.baseUrl + '/checkouts';
    const params = RestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<Page<Checkout>>(url, {params});
  }

  getCheckout(checkoutId: string): Observable<Checkout> {
    const url = this.baseUrl + '/checkout';
    const params = new HttpParams().set('id', checkoutId);
    return this.http.get<Checkout>(url, {params});
  }

  saveCheckout(checkout: Checkout): Observable<void> {
    const url = this.baseUrl + '/checkout';
    return this.http.post<void>(url, checkout);
  }

  updateReturnedDate(checkoutId: string, returnedDate: string): Observable<void> {
    const url = this.baseUrl + '/checkout';
    const params = new HttpParams()
      .set('id', checkoutId)
      .set('date', returnedDate);
    return this.http.patch<void>(url, null, {params});
  }

  deleteCheckout(checkoutId: string): Observable<void> {
    const url = this.baseUrl + '/checkout';
    const params = new HttpParams().set('checkOutId', checkoutId);
    return this.http.delete<void>(url, {params});
  }

}

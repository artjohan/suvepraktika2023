import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { Checkout } from '../../models/checkout';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html',
  styleUrls: ['./checkout-detail.component.css']
})
export class CheckoutDetailComponent implements OnInit {
  checkout$!: Observable<Checkout>

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
  ) {}

  ngOnInit(): void {
    this.checkout$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.checkoutService.getCheckout(id)))
  }
}

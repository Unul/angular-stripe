import {Component, OnInit} from "@angular/core";
import {StripeService} from "../../../projects/ng-stripe/src/lib/stripe.service";
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: "app-button-example",
  templateUrl: "./button-example.component.html",
  styleUrls: ["./button-example.component.scss"]
})
export class ButtonExampleComponent implements OnInit {

  req$: Observable<stripe.PaymentRequest>;

  constructor(private stripe: StripeService) {
  }

  ngOnInit() {
    this.req$ = this.stripe.createPaymentRequest({
      country: "FR",
      currency: "eur",
      total: {
        label: "Demo total",
        amount: 1000
      },
      requestPayerName: true,
      requestPayerEmail: true
    });
  }

}

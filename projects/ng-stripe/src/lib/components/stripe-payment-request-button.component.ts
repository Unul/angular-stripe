import {publish, tap} from "rxjs/operators";
/// <reference path="../stripe.d.ts"/>
import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {StripeElementComponent} from "../lib/abstract-stripe-element";
import {StripeElementService} from "../stripe-element.service";
import {ConnectableObservable, Observable} from "rxjs";

@Component({
  selector: "ngs-payment-request-button",
  template: "",
  styleUrls: [],
  exportAs: "ngsPaymentRequestButton"
})
export class StripePaymentRequestButtonComponent extends StripeElementComponent
  implements stripe.elements.PaymentRequestButtonElementOptions, OnInit {

  @Input()
  classes: { base: string; complete: string; empty: string; focus: string; invalid: string; webkitAutofill: string };

  @Input()
  style: {
    base?: stripe.elements.StyleOption;
    complete?: stripe.elements.StyleOption;
    empty?: stripe.elements.StyleOption;
    invalid?: stripe.elements.StyleOption;
    paymentRequestButton?: stripe.elements.PaymentRequestButtonStyleOptions
  };

  @Output()
  token = new EventEmitter<stripe.elements.TokenEvent>();
  token$: Observable<stripe.elements.TokenEvent>;

  @Output()
  click = new EventEmitter<stripe.elements.ClickEvent>();
  click$: Observable<stripe.elements.ClickEvent>;

  @Input()
  paymentRequest: stripe.PaymentRequest;


  constructor(el: ElementRef, stripeEl: StripeElementService) {
    super(el, stripeEl, "paymentRequestButton", ["ready", "token", "click"]);
  }

  protected forwardEvent(): void {
    super.forwardEvent();
    this.token$ = this.stripeEl.events.get("token").pipe(
      tap(evt => this.token.emit(evt as stripe.elements.TokenEvent)),
      publish()
    );
    (this.token$ as ConnectableObservable<stripe.elements.TokenEvent>).connect();
    this.click$ = this.stripeEl.events.get("click").pipe(
      tap(evt => this.click.emit(evt as stripe.elements.ClickEvent)),
      publish()
    );
    (this.click$ as ConnectableObservable<stripe.elements.ClickEvent>).connect();
  }

  getOptions(): stripe.elements.PaymentRequestButtonElementOptions {
    return {
      classes: this.classes,
      style: this.style,
      paymentRequest: this.paymentRequest
    };
  }

}

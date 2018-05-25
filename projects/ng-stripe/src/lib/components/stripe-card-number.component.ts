/// <reference path="../stripe.d.ts"/>
import {Component, ElementRef, Input, Optional} from "@angular/core";
import {StripeInputElementComponent} from "../lib/abstract-stripe-input";
import {StripeElementService} from "../stripe-element.service";
import {StripeService} from "../stripe.service";
import {StripeWrapperDirective} from "../directives/stripe-wrapper.directive";

@Component({
  selector: "ngs-card-number",
  template: "",
  styleUrls: [],
  providers: [StripeElementService],
  exportAs: "ngsCardNumber"
})
export class StripeCardNumberComponent extends StripeInputElementComponent implements stripe.elements.CardNumberElementOptions {

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
  @Input()
  placeholder?: string;


  constructor(stripe: StripeService, el: ElementRef, stripeEl: StripeElementService, @Optional() wrapper: StripeWrapperDirective) {
    super(stripe, el, stripeEl, "cardNumber", wrapper);
  }

  protected getOptions(): stripe.elements.CardNumberElementOptions {
    return {
      classes: this.classes,
      style: this.style,
      placeholder: this.placeholder
    };
  }

}

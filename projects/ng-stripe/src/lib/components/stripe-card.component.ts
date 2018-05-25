/// <reference path="../stripe.d.ts"/>
import {Component, ElementRef, forwardRef, Input} from "@angular/core";
import {StripeElementService} from "../stripe-element.service";
import {StripeInputElementComponent} from "../lib/abstract-stripe-input";
import {StripeService} from "../stripe.service";
import {SOURCEABLE_PROVIDER} from "../lib/sourceable.interface";
import {TOKENABLE_PROVIDER} from "../lib/tokenable.interface";

@Component({
  selector: "ngs-card",
  template: "",
  styleUrls: [],
  providers: [
    StripeElementService,
    {provide: SOURCEABLE_PROVIDER, useExisting: forwardRef(() => StripeCardComponent)},
    {provide: TOKENABLE_PROVIDER, useExisting: forwardRef(() => StripeCardComponent)}
  ],
  exportAs: "ngsCard"
})
export class StripeCardComponent extends StripeInputElementComponent implements stripe.elements.CardElementOptions {

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
  value: { [p: string]: string };
  @Input()
  hidePostalCode: boolean;
  @Input()
  iconStyle: "solid" | "default";
  @Input()
  hideIcon: boolean;


  constructor(stripe: StripeService, stripeEl: StripeElementService, el: ElementRef) {
    super(stripe, el, stripeEl, "card");
  }


  protected forwardEvent() {
    super.forwardEvent();
  }

  protected getOptions(): stripe.elements.CardElementOptions {
    return {
      classes: this.classes,
      style: this.style,
      value: this.value,
      hidePostalCode: this.hidePostalCode,
      hideIcon: this.hideIcon,
      iconStyle: this.iconStyle
    };
  }

}

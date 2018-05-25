/// <reference path="../stripe.d.ts"/>
import {Component, ElementRef, Input} from "@angular/core";
import {StripeInputElementComponent} from "../lib/abstract-stripe-input";
import {StripeElementService} from "../stripe-element.service";
import {distinctUntilChanged, map, publish, takeUntil, tap} from "rxjs/operators";
import {ConnectableObservable} from "rxjs/internal/observable/ConnectableObservable";
import {StripeService} from "../stripe.service";


@Component({
  selector: "ngs-iban",
  template: "",
  styleUrls: [],
  providers: [StripeElementService],
  exportAs: "ngsIban"
})
export class StripeIbanComponent extends StripeInputElementComponent implements stripe.elements.IbanElementOptions {

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
  supportedCountries: ["SEPA"] = ["SEPA"];
  @Input()
  placeholderCountry: string;
  @Input()
  iconStyle: string;
  @Input()
  hideIcon: boolean;


  constructor(stripe: StripeService, el: ElementRef, stripeEl: StripeElementService) {
    super(stripe, el, stripeEl, "iban");
  }

  protected getOptions(): stripe.elements.IbanElementOptions {
    return {
      classes: this.classes,
      style: this.style,
      supportedCountries: this.supportedCountries,
      placeholderCountry: this.placeholderCountry,
      iconStyle: this.iconStyle,
      hideIcon: this.hideIcon
    };
  }

}

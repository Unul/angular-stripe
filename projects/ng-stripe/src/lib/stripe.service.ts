import {
  fromEvent as observableFromEvent,
  ConnectableObservable,
  Observable,
  race as ObservableRace,
  throwError as observableThrowError
} from "rxjs";

import {publishReplay, take, map, switchMap} from "rxjs/operators";
/// <reference path="./stripe.d.ts"/>
import {Inject, Injectable} from "@angular/core";
import {STRIPE_CONFIG, StripeConfig} from "./lib/stripe-config.interface";

export const StripeJsURL = "https://js.stripe.com/v3/";

@Injectable()
export class StripeService {
  elements$: Observable<stripe.Elements>;
  stripe$: Observable<stripe.Stripe>;

  constructor(@Inject(STRIPE_CONFIG) private config: StripeConfig) {
    const script = document.createElement("script");
    script.src = StripeJsURL;
    this.stripe$ = ObservableRace(
      observableFromEvent(script, "load"),
      observableFromEvent(script, "error").pipe(switchMap(err => observableThrowError(err)))
    ).pipe(take(1), map(() => Stripe(config.apiKey)), publishReplay(1));
    document.body.appendChild(script);
    const elementsConfig: stripe.elements.Options = Object.keys(config)
      .filter(k => k !== "apiKey")
      .reduce((acc, k) => acc[k] = config[k], {});
    this.elements$ = this.stripe$.pipe(map(stripe => stripe.elements(elementsConfig)), publishReplay(1));
  }

  load() {
    (this.stripe$ as ConnectableObservable<stripe.Stripe>).connect();
    (this.elements$ as ConnectableObservable<stripe.Elements>).connect();
  }

  createSource(element?: stripe.elements.Element, sourceData?: stripe.SourceOptions): Observable<stripe.Source> {
    return this.stripe$.pipe(
      switchMap((stripe: stripe.Stripe) => {
        return stripe.createSource(element, sourceData);
      }),
      map((r: stripe.SourceResponse) => {
        if (r.error) {
          throw r.error;
        }
        return r.source;
      })
    );
  }

  createToken(element: stripe.elements.Element, tokenData?: stripe.TokenOptions) {
    return this.stripe$.pipe(
      switchMap((stripe: stripe.Stripe) => stripe.createToken(element, tokenData)),
      map((r) => {
        if (r.error) {
          throw r.error;
        }
        return r.token;
      })
    );
  }

  createPaymentRequest(options: stripe.PaymentRequestOptions) {
    return this.stripe$.pipe(
      map(stripe => stripe.paymentRequest(options))
    );
  }
}

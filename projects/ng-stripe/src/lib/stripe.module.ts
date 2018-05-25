import {ModuleWithProviders, NgModule, Provider} from "@angular/core";
import {CommonModule} from "@angular/common";
import {STRIPE_CONFIG, StripeConfig} from "./lib/stripe-config.interface";
import {StripeCardComponent} from "./components/stripe-card.component";
import {StripeCardCvcComponent} from "./components/stripe-card-cvc.component";
import {StripeCardExpiryComponent} from "./components/stripe-card-expiry.component";
import {StripeCardNumberComponent} from "./components/stripe-card-number.component";
import {StripeIbanComponent} from "./components/stripe-iban.component";
import {StripePaymentRequestButtonComponent} from "./components/stripe-payment-request-button.component";
import {StripeService} from "./stripe.service";
import {StripeSourceDirective} from "./directives/stripe-source.directive";
import {StripeSourceDataDirective} from "./directives/stripe-source-data.directive";
import {StripeWrapperDirective} from "./directives/stripe-wrapper.directive";
import {StripeTokenDirective} from "./directives/stripe-token.directive";
import {StripeTokenDataDirective} from "./directives/stripe-token-data.directive";


const providers: Provider[] = [{provide: StripeService, useClass: StripeService}];


@NgModule({
  imports: [CommonModule],
  providers: providers,
  declarations: [
    StripeCardComponent,
    StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardNumberComponent,
    StripeIbanComponent,
    StripePaymentRequestButtonComponent,
    StripeSourceDirective,
    StripeSourceDataDirective,
    StripeWrapperDirective,
    StripeTokenDirective,
    StripeTokenDataDirective
  ],
  exports: [
    StripeCardComponent,
    StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardNumberComponent,
    StripeIbanComponent,
    StripePaymentRequestButtonComponent,
    StripeSourceDirective,
    StripeSourceDataDirective,
    StripeWrapperDirective,
    StripeTokenDataDirective,
    StripeTokenDirective
  ]
})
export class StripeModule {
  static forRoot(config: StripeConfig): ModuleWithProviders {
    providers.push({provide: STRIPE_CONFIG, useValue: config});
    return {
      ngModule: StripeModule,
      providers
    };
  }
}

/// <reference path="../stripe.d.ts"/>

import {InjectionToken} from "@angular/core";

export interface StripeConfig extends stripe.elements.Options {
    apiKey: string;
}

export const STRIPE_CONFIG = new InjectionToken<StripeConfig>("stripeConfig");

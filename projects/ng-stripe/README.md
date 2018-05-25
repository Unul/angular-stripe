Angular-stripe
============

## Installation
```
npm install --save angular-stripe
```
## Use inside project
You need to import `StripeModule` inside one of your module.
```typescript
@NgModule({
  ...
  imports:[CommonModule, StripeModule],
  ...
})
export class MyModule{}
```
## Available components
### `<ngs-card>`
this component will instanciate a stripe card element including card number, cvc, expiry and postal/zip code.
```angular2html
<ngs-card
   #card="ngsCard"
   [classes]="{ base: 'base-class', complete: 'complete', 'empty': 'empty', focus: 'focus', invalid: 'invalid', webkitAutofill: 'webkitAutoFill'};"
   [hidePostalCode]="false" 
   [iconStyle]="'default'"
   [hideIcon]="false"
   [style]="{}"
   [value]="{'k':'v'}"
   (blur)="onBlur()"
   (focus)="onFocus()"
   (error)="onError($event)"
   (ready)="onReady()"  
   (change)="onChange($event)" 
   (complete)="onComplete()"></ngs-card>
```
#### Like Stripe.js
The bindings and the events emitters are the same as the one you can use with the stripe API, so []please refer to it for more informations](https://stripe.com/docs/stripe-js/reference#elements-create).

#### Not like Stripe.js
* the `complete` EventEmitter emits a boolean when the element has been fully completed.
* the `error` EventEmitter emits an error when it occurs (validation errors).
* You can make a reference to the Component using `#myRef="ngsCard"`

### `<ngs-card-number>`, `<ngs-card-expiry>`,`<ngs-card-cvc>`
If you don't want to display your card input as a single element, you will need to use these different elements.
```angular2html
  <ngs-card-number (blur)="onblur()" (change)="onchange($event)"
                   (focus)="onfocus()" (complete)="oncomplete($event)" (error)="onerror($event)"
                   (ready)="onready()"></ngs-card-number>
  <ngs-card-expiry (blur)="onblur()" (change)="onchange($event)"
                   (focus)="onfocus()" (complete)="oncomplete($event)" (error)="onerror($event)"
                   (ready)="onready()"></ngs-card-expiry>
  <ngs-card-cvc (blur)="onblur()" (change)="onchange($event)"
                (focus)="onfocus()" (complete)="oncomplete($event)" (error)="onerror($event)"
                (ready)="onready()"></ngs-card-cvc> 
```
#### Like Stripe.js

These elements also supports the same element creation options as stripe js, so once again, []please refer to it](https://stripe.com/docs/stripe-js/reference#elements-create)

#### Not like stripe.js

* Like card element , there is a `complete` and an `error` event emitter.
* Like card element, you can make a reference inside your template using `myRef="ngsCardNumber"`,`myRef="ngsCardExpiry"`,`myRef="ngsCardCvc"`.

### `<ngs-iban>`

Guess what ? This instanciate an iban element !

Well seriously, that's the same as the others and I'm tired of writing some documentation.

### `<ngs-payment-request-button>`
```angular2html
<ngs-payment-request-button *ngIf="req.canMakePayment()" [paymentRequest]="req"></ngs-payment-request-button>
```
AFAIK does not work, it needs to use https even for testing and I have no time to configure this for now.


## Available directives

### `ngsSource`

You can create a source from `ngs-card`,`ngs-iban` components or a `ngsWrapper` directive.
When the element is completed, it creates a source :

```angular2html
<ngs-card (ngsSource)="source=$event"></ngs-card>
<pre>{{source|json}}</pre>
```

### `ngsToken`

You can create a token from `ngs-card`,`ngs-iban` components or a `ngsWrapper` directive.
When the element is completed, it creates a token :

```angular2html
<ngs-card (ngsToken)="token=$event"></ngs-card>
<pre>{{token|json}}</pre>
```

### `ngsWrapper`

This directive allows to group the  `<ngs-card-number>`, `<ngs-card-expiry>` and `<ngs-card-cvc>` and emits events when all elements have completed or one emits error:

```angular2html
<p ngsWrapper (ngsComplete)="log('all completed')" (ngsError)="log('error all')">
  <ngs-card-number ></ngs-card-number>
  <ngs-card-expiry ></ngs-card-expiry>
  <ngs-card-cvc ></ngs-card-cvc>
</p>
```

declare function Stripe(apiKey: string): stripe.Stripe;

declare namespace stripe {

  interface Stripe {
    elements(options?: stripe.elements.Options): stripe.Elements;

    createToken(element: elements.Element, tokenData?: stripe.TokenOptions | stripe.BankAccountData): Promise<stripe.TokenResponse>;

    createToken(type: "bank_account", bankAccountData: stripe.BankAccountData): Promise<stripe.TokenResponse>;

    createToken(type: "pii", piiData: stripe.PiiData): Promise<stripe.TokenResponse>;

    createSource(element: elements.Element, sourceData: stripe.SourceOptions): Promise<stripe.SourceResponse>;

    createSource(sourceData: stripe.SourceOptions): Promise<stripe.SourceResponse>;

    retrieveSource(source: { id: string, clientSecret: string }): Promise<stripe.SourceResponse>;

    paymentRequest(options: stripe.PaymentRequestOptions): PaymentRequest;

  }


  export type StripeErrorType =
    "api_connection_error"
    | "api_error"
    | "authentication_error"
    | "card_error"
    | "idempotency_error"
    | "invalid_request_error"
    | "rate_limit_error" |
    "validation_error";

  export interface Error {
    type: StripeErrorType;
    charge?: string;
    code?: string;
    decline_code?: string;
    doc_url?: string;
    message?: string;
    param?: string;
  }

  export type currency = string;
  export type bank_account_status = "new" | "validated" | "verified" | "verification_failed" | "errored" ;

  export interface BankAccount {
    object: "bank_account";
    account_holder_name: string;
    account_holder_type: string;
    bank_name: string;
    country: string;
    currency: currency;
    fingerprint: string;
    last4: string;
    routing_number: string;
    status: bank_account_status;
  }

  export interface Card {
    id: string;
    object: "card";
    address_city: string;
    address_country: string;
    address_line1: string;
    address_line1_check: string;
    address_line2: string;
    address_state: string;
    address_zip: string;
    address_zip_check: string;
    brand: string;
    country: string;

    currency?: currency;
    cvc_check: string;
    dynamic_last4: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    last4: string;
    metadata: { [k: string]: any };

    name: string;
  }

  export interface Token {
    id: string;
    object: "token";
    bank_account?: BankAccount;
    card: Card;
    client_ip: string;
    created: number;
    livemode: boolean;
    type: "account" | "bank_account" | "card" | "pii";
    used: boolean;
  }

  export interface TokenResponse {
    token?: Token;
    error?: Error;
  }

  type sourceType = "ach_credit_transfer" |
    "ach_debit" |
    "alipay" |
    "bancontact" |
    "bitcoin" |
    "card" |
    "eps" |
    "giropay" |
    "ideal" |
    "multibanco" |
    "p24" |
    "sepa_credit_transfer" |
    "sepa_debit" |
    "sofort" |
    "three_d_secure";

  export interface OwnerData {
    address?: Address;
    email?: string;
    name?: string;
    phone?: string;
  }

  interface Address {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: string;
    state?: string;
  }


  export interface SourceOptions {
    type: any;
    amount?: number;
    currency?: currency;
    flow?: authenticationFlow;
    mandate?: {
      acceptance?: {
        date: number;
        ip: string;
        status: "accepted" | "refused";
        user_agent: string;
      };
      notification_method?: "email" | "manual" | "none";
    };
    metadata?: { [k: string]: any };
    owner?: OwnerData;
    statement_descriptor?: string;
    token?: Token;
    usage?: "reusable" | "single_use";
    redirect?: {
      return_url: string;
    };
    receiver?: {
      refund_attributes_method?: "email" | "manual";
    };
  }

  interface VerifiedOwner extends OwnerData {
    address: Address;
    email: string;
    name: string;
    phone: string;
    verified_address: Address;
    verified_email: string;
    verified_name: string;
    verified_phone: string;
  }

  export interface Source {
    id: string;
    object: "source";
    amount?: number;
    client_secret: string;
    code_verification?: {
      attempts_remaining: number;
      status: string;
    };
    created: number;
    currency: currency;
    flow: authenticationFlow;
    livemode: boolean;
    metadata?: { [k: string]: any };
    owner: VerifiedOwner;
    receiver?: {
      address: string;
      amount_charged: number;
      amount_received: number;
      amount_returned: number;
    };
    redirect?: {
      failure_reason?: "user_abort" | "declined" | "processing_error";
      return_url: string;
      status: "succeed" | "pending" | "failed";
      url: string;
    };
    statement_descriptor: string;
    status: "canceled" | "chargeable" | "consumed" | "failed" | "pending";
    type: sourceType;
    usage: "reusable" | "single_use";
  }

  export interface SourceResponse {
    source?: Source;
    error?: Error;
  }


  export type    authenticationFlow = "redirect" | "receiver" | "code_verification" | "none";


  export interface PiiData {
    personal_id_number: string;
  }

  export interface BankAccountData {
    country: string;

    currency: string;
    routing_number: string;

    account_number: string;

    account_holder_name: string;
    account_holder_type: string;
  }

  export interface TokenOptions {
    name: string;
    address_line1: string;
    address_line2: string;
    address_city: string;
    address_state: string;
    address_zip: string;
    address_country: string;
    currency?: string;
  }


  export interface Elements {
    create(type: elements.ElementType, options?: elements.ElementOptions): elements.Element;

    create(type: "card", options?: elements.CardElementOptions): elements.Element;

    create(type: "cardNumber", options?: elements.CardNumberElementOptions): elements.Element;

    create(type: "cardCvc", options?: elements.CardCvcElementOptions): elements.Element;

    create(type: "paymentRequestButton", options?: elements.PaymentRequestButtonElementOptions): elements.Element;

    create(type: "iban", options?: elements.IbanElementOptions): elements.Element;

    create(type: "cardExpiry", options?: elements.CardExpiryElementOptions): elements.Element;
  }

  export namespace elements {

    export interface FontOptions {
      family: string;
      src: string;
      display?: string;
      style?: string;
      unicodeRange?: string;
      weight?: string;
    }

    export interface Options {
      fonts?: (string | FontOptions)[];
      locale?: string;
    }


    export type ElementType = "card" | "cardNumber" | "cardExpiry" | "cardCvc" | "paymentRequestButton" | "iban";

    export interface StyleOption {
      color: string;
      fontFamily: string;
      fontSize: string;
      fontSmoothing: string;
      fontStyle: string;
      fontVariant: string;
      iconColor: string;
      lineHeight: string;
      textAlign: string;
      textDecoration: string;
      textShadow: string;
      textTransform: string;
      ":hover": string;
      ":focus": string;
      "::placeholder": string;
      "::selection": string;
      ":-webkit-autofill": string;
      "::-ms-clear": string;
    }

    export interface PaymentRequestButtonStyleOptions extends StyleOption {
      type: "default" | "donate" | "buy";
      theme: "dark" | "light" | "light-outline";
      height: string;
    }

    export interface ElementOptions {
      classes?: {
        base: string;
        complete: string;
        empty: string;
        focus: string;
        invalid: string;
        webkitAutofill: string;

      };
      style?: {
        base?: StyleOption;
        complete?: StyleOption;
        empty?: StyleOption;
        invalid?: StyleOption;
        paymentRequestButton?: PaymentRequestButtonStyleOptions
      };
    }

    export interface CardElementOptions extends ElementOptions {
      value?: { [k: string]: string };
      hidePostalCode?: boolean;
      iconStyle?: "solid" | "default";
      hideIcon?: boolean;
    }

    export interface CardNumberElementOptions extends ElementOptions {
      placeholder?: string;
    }

    export interface CardExpiryElementOptions extends ElementOptions {
      placeholder?: string;
    }

    export interface CardCvcElementOptions extends ElementOptions {
      placeholder?: string;
    }

    export interface PaymentRequestButtonElementOptions extends ElementOptions {
      paymentRequest: PaymentRequest;
    }

    export interface IbanElementOptions extends ElementOptions {
      supportedCountries: ["SEPA"];
      placeholderCountry?: string;
      iconStyle?: string;
      hideIcon?: boolean;
    }

    export interface Event {
      elementType: ElementType;
    }

    export interface ChangeEvent extends Event {
      empty: boolean;
      complete: boolean;
      error?: Error;
      value?: string | {};
      brand?: "mastercard" | "amex" | "discover" | "diners" | "jcb" | "unionpay" | "unknown";
      country?: string;
      bankName: string;
    }

    export interface ClickEvent extends Event {
      preventDefault(): void;
    }

    export interface TokenEvent extends Event {
      token: Token;
    }

    export type EventType = "change" | "blur" | "focus" | "ready" | "click" | "token";

    export interface Element {
      mount(domElementOrCssSelector: string | HTMLElement): void;

      on(event: EventType, handler: (event: Event) => void): void;

      on(type: "change", handler: (event: ChangeEvent) => void): void;

      on(type: "click", handler: (event: ClickEvent) => void): void;

      on(type: "token", handler: (event: TokenEvent) => void): void;

      off(type: EventType, handler: (event: Event) => void): void;

      blur(): void;

      clear(): void;

      destroy(): void;

      focus(): void;

      unmount(): void;

      update(options: ElementOptions): void;
    }
  }


  export interface PaymentItem {
    amount: number;
    label: string;
    pending?: boolean;


  }

  export interface PaymentRequestOptions {
    country: string;
    currency: string;
    total: PaymentItem;
    displayItems?: PaymentItem[];
    requestPayerName?: boolean;
    requestPayerEmail?: boolean;
    requestPayerPhone?: boolean;
    requestShipping?: boolean;
    shippingOptions?: ShippingOption[];

  }


  export interface PaymentRequestEvent {

  }

  export interface ShippingAddressChangeEvent extends PaymentRequestEvent {
    shippingAddress: ShippingAddress;

    updateWith(details: UpdateDetails): void;

  }

  export interface ShippingOptionChangeEvent extends PaymentRequestEvent {
    shippingOptions: ShippingOption;

    updateWith(details: UpdateDetails): void;

  }

  export interface PaymentRequest {
    canMakePayment(): Promise<boolean | null>;

    show(): void;

    update(options: PaymentRequestOptions): void;

    on(type: "token" | "source", handler: (event: PaymentResponse) => void): void;

    on(type: "cancel", handler: (event: PaymentRequestEvent) => void): void;

    on(type: "shippingaddresschange", handler: (event: ShippingAddressChangeEvent) => void): void;

    on(type: "shippingoptionchange", handler: (event: ShippingOptionChangeEvent) => void): void;
  }

  export interface PaymentResponse {
    token?: Token;
    source?: Source;
    payerName: string;
    payerEmail: string;
    payerPhone: string;
    shippingAddress?: ShippingAddress;
    shippingOption?: ShippingOption;
    methodName: string;

    complete(status: "success" |
      "fail" |
      "invalid_payer_name" |
      "invalid_payer_phone" |
      "invalid_payer_email" |
      "invalid_shipping_address"): void;
  }

  export interface UpdateDetails {
    status: "success" | "fail" | "invalid_shippinng_address";
    total?: PaymentItem;
    displayItems?: PaymentItem[];
    shippingOptions?: ShippingOption[];
  }

  export interface ShippingOption {
    id: string;
    label: string;
    detail: string;
    amount: number;
  }

  export interface ShippingAddress {
    country: string;
    addressLine: Array<string>;
    region: string;
    city: string;
    postalCode: string;
    recipient: string;
    phone: string;
    sortingCode: string;
    dependentLocality: string;
  }
}


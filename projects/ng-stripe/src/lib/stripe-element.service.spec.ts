import { TestBed, inject } from "@angular/core/testing";

import { StripeElementService } from "./stripe-element.service";

describe("StripeElementService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StripeElementService]
    });
  });

  it("should be created", inject([StripeElementService], (service: StripeElementService) => {
    expect(service).toBeTruthy();
  }));
});

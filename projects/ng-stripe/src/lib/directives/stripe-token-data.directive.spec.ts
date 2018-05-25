import { StripeTokenDataDirective } from "./stripe-token-data.directive";

describe("TokenDataDirective", () => {
  it("should create an instance", () => {
    const directive = new StripeTokenDataDirective();
    expect(directive).toBeTruthy();
  });
});

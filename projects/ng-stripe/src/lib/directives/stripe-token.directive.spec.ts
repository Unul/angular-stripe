import { StripeTokenDirective } from "./stripe-token.directive";

describe("TokenDirective", () => {
  it("should create an instance", () => {
    const directive = new StripeTokenDirective();
    expect(directive).toBeTruthy();
  });
});

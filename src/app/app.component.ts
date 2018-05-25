import {Component} from "@angular/core";
import {StripeService} from "../../projects/ng-stripe/src/lib/stripe.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "app";

  constructor(stripe: StripeService) {
    stripe.load();
  }
}

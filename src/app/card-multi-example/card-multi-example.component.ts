import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {StripeCardNumberComponent} from "../../../projects/ng-stripe/src/lib/components/stripe-card-number.component";

@Component({
  selector: "app-card-multi-example",
  templateUrl: "./card-multi-example.component.html",
  styleUrls: ["./card-multi-example.component.scss"]
})
export class CardMultiExampleComponent implements OnInit, AfterViewInit {
  @ViewChild(StripeCardNumberComponent)
  cardNumber: StripeCardNumberComponent;


  constructor() {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
  }

  log(...data: any[]) {
    console.log(...data);
  }
}

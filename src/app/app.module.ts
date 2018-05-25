import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {StripeModule} from "../../projects/ng-stripe/src/lib/stripe.module";
import {RouterModule, Routes} from "@angular/router";
import {CardExampleComponent} from "./card-example/card-example.component";
import {CardMultiExampleComponent} from "./card-multi-example/card-multi-example.component";
import {IbanExampleComponent} from "./iban-example/iban-example.component";
import {ButtonExampleComponent} from "./button-example/button-example.component";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule} from "@angular/material";
import {environment} from "../environments/environment";

const routes: Routes = [
    {
      path: "",
      component: CardExampleComponent
    }, {
      path: "card-multi",
      component: CardMultiExampleComponent
    },
    {
      path: "iban",
      component: IbanExampleComponent
    },
    {
      path: "button",
      component: ButtonExampleComponent
    }
  ]
;

@NgModule({
  declarations: [
    AppComponent,
    CardExampleComponent,
    CardMultiExampleComponent,
    IbanExampleComponent,
    ButtonExampleComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {useHash: true}),
    BrowserAnimationsModule,
    StripeModule.forRoot({apiKey: environment.apiKey}),
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

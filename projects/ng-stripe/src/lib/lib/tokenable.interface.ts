import {Observable} from "rxjs/internal/Observable";
import {InjectionToken} from "@angular/core";

export const TOKENABLE_PROVIDER = new InjectionToken("Tokenable provider");

export interface Tokenable {
  createToken(TokenData?: stripe.TokenOptions): Observable<stripe.Token>;
}

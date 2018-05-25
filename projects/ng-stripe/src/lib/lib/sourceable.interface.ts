import {Observable} from "rxjs/internal/Observable";
import {InjectionToken} from "@angular/core";

export const SOURCEABLE_PROVIDER = new InjectionToken("Sourceable provider");

export interface Sourceable {
  createSource(sourceData?: stripe.SourceOptions): Observable<stripe.Source>;
}

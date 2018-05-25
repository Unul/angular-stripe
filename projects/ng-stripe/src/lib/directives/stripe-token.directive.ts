import {Directive, EventEmitter, Inject, OnDestroy, OnInit, Optional, Output} from "@angular/core";
import {catchError, publish, switchMap, takeUntil, tap} from "rxjs/operators";
import {ConnectableObservable, Subject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";
import {TOKENABLE_PROVIDER, Tokenable} from "../lib/tokenable.interface";
import {StripeTokenDataDirective} from "./stripe-token-data.directive";
import {NEVER} from "rxjs/internal/observable/never";


@Directive({
  selector: "[ngsToken]"
})
export class StripeTokenDirective implements OnInit, OnDestroy {
  @Output()
  ngsToken = new EventEmitter<stripe.Token>();
  @Output()
  ngsTokenError = new EventEmitter<stripe.Error | Error>();
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(TOKENABLE_PROVIDER) private sourceable: Tokenable,
    @Optional() private tokenDataDirective?: StripeTokenDataDirective) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    let obs: Observable<stripe.Token>;
    if (this.tokenDataDirective) {
      obs = this.tokenDataDirective.tokenData$.pipe(
        switchMap(data => this.sourceable.createToken(data)),
      );
    } else {

      obs = this.sourceable.createToken();
    }
    obs.pipe(
      catchError(err => {
        this.ngsTokenError.emit(err);
        return NEVER;
      }),
      tap(source => this.ngsToken.emit(source)),
      takeUntil(this.destroy$),
      publish()
    );
    (obs as ConnectableObservable<stripe.Token>).connect();
  }


}

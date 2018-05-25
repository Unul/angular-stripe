import {Directive, Input, OnDestroy} from "@angular/core";
import {Observable, ReplaySubject, Subject} from "rxjs/index";
import {takeUntil} from "rxjs/operators";

@Directive({
  selector: "[ngsTokenData]"
})
export class StripeTokenDataDirective implements OnDestroy {

  private _tokenData$ = new ReplaySubject<stripe.TokenOptions>(1);
  private _destroy$ = new Subject<void>();
  tokenData$: Observable<stripe.TokenOptions>;

  @Input()
  set ngsTokenData(source: stripe.TokenOptions) {
    this._tokenData$.next(source);
  }

  constructor() {
    this.tokenData$ = this.tokenData$.pipe(takeUntil(this._destroy$));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }


}

import {Directive, Input, OnDestroy} from "@angular/core";
import {Observable, ReplaySubject, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import SourceData = stripe.SourceOptions;

@Directive({
  selector: "ngs-card[ngsSourceData]"
})
export class StripeSourceDataDirective implements OnDestroy {

  private _sourceData$ = new ReplaySubject<SourceData>(1);
  private _destroy$ = new Subject<void>();
  sourceData$: Observable<SourceData>;

  @Input("ngsSourceData")
  set(source: stripe.SourceOptions) {
    this._sourceData$.next(source);
  }

  constructor() {
    this.sourceData$ = this.sourceData$.pipe(takeUntil(this._destroy$));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }


}

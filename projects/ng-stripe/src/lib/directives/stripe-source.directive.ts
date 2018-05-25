import {Directive, EventEmitter, Inject, OnDestroy, OnInit, Optional, Output} from "@angular/core";
import {catchError, publish, switchMap, takeUntil, tap} from "rxjs/operators";
import {StripeSourceDataDirective} from "./stripe-source-data.directive";
import {ConnectableObservable, Subject} from "rxjs";
import {Sourceable, SOURCEABLE_PROVIDER} from "../lib/sourceable.interface";
import {Observable} from "rxjs/internal/Observable";
import {NEVER} from "rxjs/internal/observable/never";


@Directive({
  selector: "ngs-card[ngsSource]"
})
export class StripeSourceDirective implements OnInit, OnDestroy {
  @Output()
  ngsSource = new EventEmitter<stripe.Source>();
  @Output()
  ngsSourceError = new EventEmitter<stripe.Error | Error>();
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(SOURCEABLE_PROVIDER) private sourceable: Sourceable,
    @Optional() private sourceDataDirective?: StripeSourceDataDirective) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  ngOnInit(): void {
    let obs: Observable<stripe.Source>;
    if (this.sourceDataDirective) {
      obs = this.sourceDataDirective.sourceData$.pipe(
        switchMap((data) => this.sourceable.createSource(data)),
      );
    } else {
      obs = this.sourceable.createSource();
    }
    obs = obs.pipe(
      catchError(err => {
        this.ngsSourceError.emit(err);
        return NEVER;
      }),
      tap(source => this.ngsSource.emit(source)),
      takeUntil(this.destroy$),
      publish()
    );
    (obs as ConnectableObservable<stripe.Source>).connect();
  }


}

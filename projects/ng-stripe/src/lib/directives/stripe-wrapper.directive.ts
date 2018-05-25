import {Directive, EventEmitter, forwardRef, OnDestroy, OnInit, Output} from "@angular/core";
import {
  distinctUntilChanged,
  map,
  publishReplay,
  scan,
  startWith,
  switchMap,
  switchMapTo,
  takeUntil,
  tap
} from "rxjs/operators";
import {combineLatest, ConnectableObservable, Observable, Subject} from "rxjs";
import {StripeService} from "../stripe.service";
import {Sourceable, SOURCEABLE_PROVIDER} from "../lib/sourceable.interface";
import {Tokenable, TOKENABLE_PROVIDER} from "../lib/tokenable.interface";
import {ReplaySubject} from "rxjs/internal/ReplaySubject";

export interface WrappableElement {
  complete$: Observable<boolean>;
  error$: Observable<stripe.Error>;
  el$: Observable<stripe.elements.Element>;
}

@Directive({
  selector: "[ngsWrapper]",
  providers: [
    {provide: SOURCEABLE_PROVIDER, useExisting: forwardRef(() => StripeWrapperDirective)},
    {provide: TOKENABLE_PROVIDER, useExisting: forwardRef(() => StripeWrapperDirective)}
  ]
})
export class StripeWrapperDirective implements OnInit, OnDestroy, Sourceable, Tokenable {
  @Output("ngsComplete")
  ngsComplete = new EventEmitter<boolean>();
  complete$: Observable<boolean>;
  @Output("ngsError")
  ngsError = new EventEmitter<stripe.Error[]>();
  error$: Observable<stripe.Error[]>;
  private _addElement$ = new Subject<WrappableElement>();
  private _removeElement$ = new Subject<WrappableElement>();
  private _destroy$ = new Subject<void>();
  init$: Observable<void>;
  private _init$ = new ReplaySubject<void>(1);

  inputs$: Observable<WrappableElement[]>;

  constructor(private stripe: StripeService) {
    this.inputs$ = combineLatest(
      this._addElement$.pipe(
        scan((acc: WrappableElement[], el: WrappableElement) => {
          acc.push(el);
          return acc;
        }, [] as WrappableElement[])
      ),
      this._removeElement$.pipe(startWith(null))
    ).pipe(
      map(([added, removed]) => added.filter(el => el !== removed)),
      distinctUntilChanged(),
      takeUntil(this._destroy$),
      publishReplay(1)
    );
    (this.inputs$ as ConnectableObservable<WrappableElement[]>).connect();

    this.complete$ = this.inputs$.pipe(
      map(inputs => inputs.map(i => i.complete$)),
      switchMap(all => combineLatest(...all)),
      map(all => all.every(complete => complete)),
      distinctUntilChanged(),
      tap(complete => this.ngsComplete.emit(complete)),
      takeUntil(this._destroy$),
      publishReplay(1),
    );
    (this.complete$ as ConnectableObservable<boolean>).connect();

    this.error$ = this.inputs$.pipe(
      map(inputs => inputs.map(i => i.error$)),
      switchMap(errors => combineLatest(...errors)),
      map(all => all.filter(error => !!error)),
      distinctUntilChanged(),
      tap(errors => this.ngsError.emit(errors)),
      takeUntil(this._destroy$),
      publishReplay(1)
    );
    (this.error$ as ConnectableObservable<stripe.Error[]>).connect();
  }

  createSource(options?: stripe.SourceOptions) {
    return this.init$.pipe(
      switchMapTo(this.inputs$.pipe(
        map(inputs => inputs[0]),
        switchMap(input => {
          if (!input) {
            throw new Error("Cannot create a Stripe source from a wrapper containing no element");
          }
          return input.el$;
        }),
        switchMap(el => this.stripe.createSource(el, options))
      ))
    );
  }

  ngOnInit(): void {
    this._init$.next();
  }

  createToken(options?: stripe.TokenOptions) {
    return this.init$.pipe(
      switchMapTo(this.inputs$.pipe(
        map(inputs => inputs[0]),
        switchMap(input => {
          if (!input) {
            throw new Error("Cannot create a Stripe token from a wrapper containing no element");
          }
          return input.el$;
        }),
        switchMap(el => this.stripe.createToken(el, options))
      ))
    );
  }

  registerStripeInput(input: WrappableElement) {
    this._addElement$.next(input);
  }

  removeStripeInput(input: WrappableElement) {
    this._removeElement$.next(input);
  }

  ngOnDestroy(): void {
    this._init$.complete();
    this._addElement$.complete();
    this._removeElement$.complete();
  }

}

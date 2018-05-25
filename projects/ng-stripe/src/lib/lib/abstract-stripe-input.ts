import {StripeElementComponent} from "./abstract-stripe-element";
import {ElementRef, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {StripeElementService} from "../stripe-element.service";
import {Observable} from "rxjs/internal/Observable";
import {
  distinctUntilChanged,
  filter,
  map,
  publish,
  publishReplay,
  switchMap,
  switchMapTo,
  takeUntil,
  tap
} from "rxjs/operators";
import {ConnectableObservable} from "rxjs/internal/observable/ConnectableObservable";
import {StripeService} from "../stripe.service";
import {StripeWrapperDirective} from "../directives/stripe-wrapper.directive";

export abstract class StripeInputElementComponent extends StripeElementComponent implements OnInit, OnDestroy {
  @Output()
  change = new EventEmitter<stripe.elements.ChangeEvent>();
  change$: Observable<stripe.elements.ChangeEvent>;

  @Output()
  focus = new EventEmitter<stripe.elements.Event>();
  focus$: Observable<stripe.elements.Event>;

  @Output()
  blur = new EventEmitter<stripe.elements.Event>();
  blur$: Observable<stripe.elements.Event>;

  @Output()
  complete = new EventEmitter<boolean>();
  complete$: Observable<boolean>;

  @Output()
  error = new EventEmitter<stripe.Error>();
  error$: Observable<stripe.Error>;

  protected constructor(
    protected stripe: StripeService,
    el: ElementRef,
    stripeEl: StripeElementService,
    elType: stripe.elements.ElementType,
    protected wrapper?: StripeWrapperDirective,
    eventTypes: stripe.elements.EventType[] = ["ready", "blur", "focus", "change"]) {
    super(el, stripeEl, elType, eventTypes);
  }


  ngOnInit(): void {
    super.ngOnInit();
    if (this.wrapper) {
      this.wrapper.registerStripeInput(this);
    }
  }

  ngOnDestroy(): void {
    if (this.wrapper) {
      this.wrapper.removeStripeInput(this);
    }
    super.ngOnDestroy();
  }

  protected forwardEvent() {
    super.forwardEvent();
    this.blur$ = this.stripeEl.events.get("blur").pipe(
      tap(evt => {
        this.blur.emit(evt);
      }),
      publish()
    );
    this.focus$ = this.stripeEl.events.get("focus").pipe(
      tap(evt => {
        this.focus.emit(evt);
      }),
      publish()
    );
    this.change$ = (this.stripeEl.events.get("change") as Observable<stripe.elements.ChangeEvent>).pipe(
      tap(evt => this.change.emit(evt)),
      publish()
    );
    this.complete$ = this.change$.pipe(
      map(evt => {
        return evt.complete;
      }),
      tap((complete) => this.complete.emit(complete)),
      distinctUntilChanged(),
      takeUntil(this.destroy$),
      publishReplay(1)
    );
    this.error$ = this.change$.pipe(
      map(evt => evt.error),
      distinctUntilChanged(),
      tap(err => this.error.emit(err)),
      takeUntil(this.destroy$),
      publishReplay(1)
    );
    const connectables = [this.blur$, this.focus$, this.change$, this.error$, this.complete$];
    (connectables as ConnectableObservable<any>[]).forEach(obs => {
      obs.connect();
    });
  }

  createSource(sourceData?: stripe.SourceOptions): Observable<stripe.Source> {
    const source$ = this.init$.pipe(
      switchMapTo(this.el$.pipe(
        switchMap(el => this.change$.pipe(
          filter(evt => {
            return !evt.error && evt.complete;
          }),
          switchMap(() => {
            return this.stripe.createSource(el, sourceData);
          })
        )),
        takeUntil(this.destroy$)
      ))
    );
    return source$;
  }

  createToken(tokenData?: stripe.TokenOptions): Observable<stripe.Token> {
    const token$ = this.init$.pipe(
      switchMapTo(this.el$.pipe(
        switchMap(el => this.change$.pipe(
          filter(evt => {
            return !evt.error && evt.complete;
          }),
          switchMap(() => {
            return this.stripe.createToken(el, tokenData);
          })
          )
        ),
        takeUntil(this.destroy$)
      ))
    );
    return token$;
  }

}

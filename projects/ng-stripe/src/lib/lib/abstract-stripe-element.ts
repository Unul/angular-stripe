import {ConnectableObservable, Observable, ReplaySubject, Subject} from "rxjs/index";
import {ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from "@angular/core";
import {StripeElementService} from "../stripe-element.service";
import {publish, tap} from "rxjs/operators";

/// <reference path="../stripe.d.ts"/>
export abstract class StripeElementComponent implements OnInit, OnDestroy, OnChanges {
  el$: Observable<stripe.elements.Element>;
  ready$: Observable<stripe.elements.Event>;

  @Output()
  ready = new EventEmitter<stripe.elements.Event>();

  destroy$: Observable<void>;
  changes$: Observable<SimpleChanges>;
  init$: Observable<void>;
  private _destroy$ = new Subject<void>();
  private _changes$ = new Subject<SimpleChanges>();
  private _init$ = new ReplaySubject<void>(1);


  protected constructor(
    protected el: ElementRef,
    protected stripeEl: StripeElementService,
    protected elType: stripe.elements.ElementType,
    protected eventTypes: stripe.elements.EventType[] = ["ready"]) {
    this.changes$ = this._changes$;
    this.destroy$ = this._destroy$;
    this.init$ = this._init$;
  }

  ngOnInit(): void {
    this.stripeEl.updateOptions(this.getOptions());
    this.el$ = this.stripeEl.buildEl(this.elType, this.el, this.eventTypes);
    this.forwardEvent();
    this._init$.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stripeEl.updateOptions(this.getOptions());
    this._changes$.next(changes);
  }

  ngOnDestroy(): void {
    this.stripeEl.destroyEl();
    this._destroy$.next();
    this._destroy$.complete();
    this._changes$.complete();
    this._init$.complete();
  }

  protected abstract getOptions(): stripe.elements.ElementOptions;

  protected forwardEvent() {
    this.ready$ = this.stripeEl.events.get("ready").pipe(
      tap(evt => this.ready.emit(evt)),
      publish()
    );
    (this.ready$ as ConnectableObservable<stripe.elements.Event>).connect();
  }
}

import {ElementRef, Injectable} from "@angular/core";
import {StripeService} from "./stripe.service";
import {
  distinctUntilChanged,
  ignoreElements,
  map,
  publishReplay,
  switchMap,
  take,
  takeUntil,
  tap
} from "rxjs/operators";
import {ConnectableObservable} from "rxjs/internal/observable/ConnectableObservable";
import {Subject} from "rxjs/internal/Subject";
import {combineLatest, merge, Observable, ReplaySubject} from "rxjs/index";


@Injectable({
  providedIn: "root"
})
export class StripeElementService {


  private destroy$ = new Subject<void>();
  private options$ = new ReplaySubject<stripe.elements.ElementOptions>(1);
  events = new Map<stripe.elements.EventType, Observable<stripe.elements.Event>>();
  el$: Observable<stripe.elements.Element>;

  constructor(private stripe: StripeService) {

  }

  buildEl(type: stripe.elements.ElementType, elRef: ElementRef,
          eventTypes: stripe.elements.EventType[] = ["change", "focus", "blur", "ready"]) {
    const initialEl$ = combineLatest(this.stripe.elements$, this.options$).pipe(
      map(([elements, options]) => elements.create(type, options)),
      tap(el => el.mount(elRef.nativeElement)),
      take(1),
      publishReplay(1),
    ) as ConnectableObservable<stripe.elements.Element>;
    initialEl$.connect(); // TODO: switch to .refCount() if possible
    const destroyEl$ = initialEl$.pipe(
      switchMap(el => this.destroy$.pipe(tap(() => el.destroy())))
    );
    const updateEl$ = combineLatest(initialEl$, this.options$).pipe(
      tap(([el, options]) => el.update(options)),
      ignoreElements()
    );
    const el$: ConnectableObservable<stripe.elements.Element> = merge(
      initialEl$,
      updateEl$
    ).pipe(
      distinctUntilChanged(),
      takeUntil(destroyEl$),
      publishReplay(1)
    ) as ConnectableObservable<stripe.elements.Element>;
    el$.connect();
    this.el$ = el$;
    this.forwardEvents(eventTypes);
    return this.el$;
  }

  protected forwardEvents(eventTypes: stripe.elements.EventType[]) {
    eventTypes.forEach((evt => {
      const event$ = this.el$.pipe(
        switchMap(el => this.listenEvent(evt)),
        takeUntil(this.destroy$),
      );
      this.events.set(evt, event$);
    }));
  }

  listenEvent(eventType: stripe.elements.EventType): Observable<stripe.elements.Event> {
    return this.el$.pipe(switchMap(el => new Observable((observer) => {
      const handler = evt => observer.next(evt);
      el.on(eventType, handler);
      return () => el.off(eventType, handler);
    })));
  }

  destroyEl() {
    this.destroy$.next();
    this.destroy$.complete();
    this.options$.complete();
  }

  updateOptions(options: stripe.elements.ElementOptions) {
    this.options$.next(options);
  }
}

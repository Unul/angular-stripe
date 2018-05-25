import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CardMultiExampleComponent } from "./card-multi-example.component";

describe("CardMultiExampleComponent", () => {
  let component: CardMultiExampleComponent;
  let fixture: ComponentFixture<CardMultiExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardMultiExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMultiExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

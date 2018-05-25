import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { IbanExampleComponent } from "./iban-example.component";

describe("IbanExampleComponent", () => {
  let component: IbanExampleComponent;
  let fixture: ComponentFixture<IbanExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbanExampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbanExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

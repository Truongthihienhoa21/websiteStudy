import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesPaymentComponent } from './courses-payment.component';

describe('CoursesPaymentComponent', () => {
  let component: CoursesPaymentComponent;
  let fixture: ComponentFixture<CoursesPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwalAlertComponent } from './swal-alert.component';

describe('SwalAlertComponent', () => {
  let component: SwalAlertComponent;
  let fixture: ComponentFixture<SwalAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwalAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwalAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

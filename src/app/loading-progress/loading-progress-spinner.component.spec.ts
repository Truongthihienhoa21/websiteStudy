import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingProgressSpinnerComponent } from './loading-progress-spinner.component';

describe('LoadingProgressSpinnerComponent', () => {
  let component: LoadingProgressSpinnerComponent;
  let fixture: ComponentFixture<LoadingProgressSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingProgressSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingProgressSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNetworkComponent } from './error-network.component';

describe('ErrorNetworkComponent', () => {
  let component: ErrorNetworkComponent;
  let fixture: ComponentFixture<ErrorNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLogComponent } from './input-log.component';

describe('InputLogComponent', () => {
  let component: InputLogComponent;
  let fixture: ComponentFixture<InputLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentResolveComponent } from './assignment-resolve.component';

describe('AssignmentResolveComponent', () => {
  let component: AssignmentResolveComponent;
  let fixture: ComponentFixture<AssignmentResolveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentResolveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentResolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

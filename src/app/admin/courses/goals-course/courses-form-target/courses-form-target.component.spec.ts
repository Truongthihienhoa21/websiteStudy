import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesFormTargetComponent } from './courses-form-target.component';

describe('CoursesFormTargetComponent', () => {
  let component: CoursesFormTargetComponent;
  let fixture: ComponentFixture<CoursesFormTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesFormTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesFormTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

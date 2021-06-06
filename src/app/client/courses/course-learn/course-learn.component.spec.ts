import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLearnComponent } from './course-learn.component';

describe('CourseLearnComponent', () => {
  let component: CourseLearnComponent;
  let fixture: ComponentFixture<CourseLearnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseLearnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

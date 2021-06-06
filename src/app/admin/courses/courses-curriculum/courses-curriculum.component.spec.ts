import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesCurriculumComponent } from './courses-curriculum.component';

describe('CoursesCurriculumComponent', () => {
  let component: CoursesCurriculumComponent;
  let fixture: ComponentFixture<CoursesCurriculumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesCurriculumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesCurriculumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

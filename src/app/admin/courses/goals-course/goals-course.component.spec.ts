import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsCourseComponent } from './goals-course.component';

describe('GoalsCourseComponent', () => {
  let component: GoalsCourseComponent;
  let fixture: ComponentFixture<GoalsCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalsCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

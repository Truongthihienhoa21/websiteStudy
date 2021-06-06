import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesLandingpageComponent } from './courses-landingpage.component';

describe('CoursesLandingpageComponent', () => {
  let component: CoursesLandingpageComponent;
  let fixture: ComponentFixture<CoursesLandingpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesLandingpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesLandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

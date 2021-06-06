import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumItemComponent } from './curriculum-item.component';

describe('CurriculumItemComponent', () => {
  let component: CurriculumItemComponent;
  let fixture: ComponentFixture<CurriculumItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurriculumItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurriculumItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

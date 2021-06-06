import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathCategoryComponent } from './path-category.component';

describe('PathCategoryComponent', () => {
  let component: PathCategoryComponent;
  let fixture: ComponentFixture<PathCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

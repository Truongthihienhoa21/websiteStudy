import { TestBed } from '@angular/core/testing';

import { LearningGuard } from './learning.guard';

describe('LearningGuard', () => {
  let guard: LearningGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LearningGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

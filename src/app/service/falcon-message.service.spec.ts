import { TestBed } from '@angular/core/testing';

import { FalconMessageService } from './falcon-message.service';

describe('FalconMessageService', () => {
  let service: FalconMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FalconMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

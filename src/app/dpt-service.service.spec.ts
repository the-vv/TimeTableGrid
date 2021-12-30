import { TestBed } from '@angular/core/testing';

import { DptServiceService } from './dpt-service.service';

describe('DptServiceService', () => {
  let service: DptServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DptServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

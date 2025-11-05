import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';  // ← Düzelt

describe('ApiService', () => {  // ← Düzelt
  let service: ApiService;  // ← Düzelt

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);  // ← Düzelt
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
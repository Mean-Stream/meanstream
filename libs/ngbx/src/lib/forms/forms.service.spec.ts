import {TestBed} from '@angular/core/testing';
import {IsOptional, ValidateIf} from 'class-validator';
import {FormsService} from './forms.service';

describe('FormsService', () => {
  let service: FormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect the IsOptional decorator', () => {
    class Test {
      @IsOptional()
      name?: string;

      @ValidateIf((object) => object.name)
      age?: number;
    }

    const fields = service.parse(Test);
    expect(fields[0].required).toBe(false);
    expect(fields[1].required).toBe(true);
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidatorFormComponent} from '@nestx/ngbx';

describe('ValidatorFormComponent', () => {
  let component: ValidatorFormComponent<object>;
  let fixture: ComponentFixture<ValidatorFormComponent<object>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidatorFormComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

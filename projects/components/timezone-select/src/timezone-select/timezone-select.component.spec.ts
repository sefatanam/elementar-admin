import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneSelectComponent } from './timezone-select.component';

describe('TimezoneSelectComponent', () => {
  let component: TimezoneSelectComponent;
  let fixture: ComponentFixture<TimezoneSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimezoneSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimezoneSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

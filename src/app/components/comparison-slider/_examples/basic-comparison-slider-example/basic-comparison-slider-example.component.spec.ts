import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicComparisonSliderExampleComponent } from './basic-comparison-slider-example.component';

describe('BasicComparisonSliderExampleComponent', () => {
  let component: BasicComparisonSliderExampleComponent;
  let fixture: ComponentFixture<BasicComparisonSliderExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicComparisonSliderExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicComparisonSliderExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

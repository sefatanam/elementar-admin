import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicCountrySelectExampleComponent } from './basic-country-select-example.component';

describe('BasicCountrySelectExampleComponent', () => {
  let component: BasicCountrySelectExampleComponent;
  let fixture: ComponentFixture<BasicCountrySelectExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicCountrySelectExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicCountrySelectExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

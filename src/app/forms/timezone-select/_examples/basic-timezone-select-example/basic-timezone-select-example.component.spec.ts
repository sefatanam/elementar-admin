import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTimezoneSelectExampleComponent } from './basic-timezone-select-example.component';

describe('BasicTimezoneSelectExampleComponent', () => {
  let component: BasicTimezoneSelectExampleComponent;
  let fixture: ComponentFixture<BasicTimezoneSelectExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicTimezoneSelectExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicTimezoneSelectExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

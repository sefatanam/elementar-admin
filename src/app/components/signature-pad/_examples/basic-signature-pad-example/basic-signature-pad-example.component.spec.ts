import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSignaturePadExampleComponent } from './basic-signature-pad-example.component';

describe('BasicSignaturePadExampleComponent', () => {
  let component: BasicSignaturePadExampleComponent;
  let fixture: ComponentFixture<BasicSignaturePadExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicSignaturePadExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicSignaturePadExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

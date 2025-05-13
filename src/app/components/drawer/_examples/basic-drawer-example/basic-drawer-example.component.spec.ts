import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDrawerExampleComponent } from './basic-drawer-example.component';

describe('BasicDrawerExampleComponent', () => {
  let component: BasicDrawerExampleComponent;
  let fixture: ComponentFixture<BasicDrawerExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDrawerExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDrawerExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

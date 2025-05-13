import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerWithoutBackdropExampleComponent } from './drawer-without-backdrop-example.component';

describe('DrawerWithoutBackdropExampleComponent', () => {
  let component: DrawerWithoutBackdropExampleComponent;
  let fixture: ComponentFixture<DrawerWithoutBackdropExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerWithoutBackdropExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerWithoutBackdropExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

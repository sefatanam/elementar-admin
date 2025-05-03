import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayScrollbarComponent } from './overlay-scrollbar.component';

describe('OverlayScrollbarComponent', () => {
  let component: OverlayScrollbarComponent;
  let fixture: ComponentFixture<OverlayScrollbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayScrollbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayScrollbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

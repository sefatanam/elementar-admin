import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationTimeComponent } from './notification-time.component';

describe('NotificationTimeComponent', () => {
  let component: NotificationTimeComponent;
  let fixture: ComponentFixture<NotificationTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

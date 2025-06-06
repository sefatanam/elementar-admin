import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationContentComponent } from './notification-content.component';

describe('NotificationContentComponent', () => {
  let component: NotificationContentComponent;
  let fixture: ComponentFixture<NotificationContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

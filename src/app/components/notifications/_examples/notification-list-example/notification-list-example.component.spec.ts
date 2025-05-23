import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationListExampleComponent } from './notification-list-example.component';

describe('NotificationListExampleComponent', () => {
  let component: NotificationListExampleComponent;
  let fixture: ComponentFixture<NotificationListExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationListExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationListExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

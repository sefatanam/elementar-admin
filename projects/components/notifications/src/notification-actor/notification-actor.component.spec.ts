import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationActorComponent } from './notification-actor.component';

describe('NotificationActorComponent', () => {
  let component: NotificationActorComponent;
  let fixture: ComponentFixture<NotificationActorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationActorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

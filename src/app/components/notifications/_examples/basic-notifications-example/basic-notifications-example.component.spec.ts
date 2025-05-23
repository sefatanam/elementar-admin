import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicNotificationsExampleComponent } from './basic-notifications-example.component';

describe('BasicNotificationsExampleComponent', () => {
  let component: BasicNotificationsExampleComponent;
  let fixture: ComponentFixture<BasicNotificationsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicNotificationsExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicNotificationsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

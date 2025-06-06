import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarNavDividerComponent } from './sidebar-nav-divider.component';

describe('SidebarNavDividerComponent', () => {
  let component: SidebarNavDividerComponent;
  let fixture: ComponentFixture<SidebarNavDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarNavDividerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarNavDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

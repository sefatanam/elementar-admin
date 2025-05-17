import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePanelTabComponent } from './side-panel-tab.component';

describe('SidePanelTabComponent', () => {
  let component: SidePanelTabComponent;
  let fixture: ComponentFixture<SidePanelTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidePanelTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidePanelTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

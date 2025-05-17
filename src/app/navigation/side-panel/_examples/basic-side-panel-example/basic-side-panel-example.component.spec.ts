import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSidePanelExampleComponent } from './basic-side-panel-example.component';

describe('BasicSidePanelExampleComponent', () => {
  let component: BasicSidePanelExampleComponent;
  let fixture: ComponentFixture<BasicSidePanelExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicSidePanelExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicSidePanelExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

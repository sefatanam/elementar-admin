import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicSidenavExampleComponent } from './basic-sidenav-example.component';

describe('BasicSidenavExampleComponent', () => {
  let component: BasicSidenavExampleComponent;
  let fixture: ComponentFixture<BasicSidenavExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicSidenavExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicSidenavExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadContainerComponent } from './upload-container.component';

describe('UploadContainerComponent', () => {
  let component: UploadContainerComponent;
  let fixture: ComponentFixture<UploadContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

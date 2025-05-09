import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMaxFileSizeComponent } from './upload-max-file-size.component';

describe('UploadMaxFileSizeComponent', () => {
  let component: UploadMaxFileSizeComponent;
  let fixture: ComponentFixture<UploadMaxFileSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadMaxFileSizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadMaxFileSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

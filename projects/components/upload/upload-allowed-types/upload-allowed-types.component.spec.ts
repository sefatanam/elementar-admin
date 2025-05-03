import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAllowedTypesComponent } from './upload-allowed-types.component';

describe('UploadAllowedTypesComponent', () => {
  let component: UploadAllowedTypesComponent;
  let fixture: ComponentFixture<UploadAllowedTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAllowedTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAllowedTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

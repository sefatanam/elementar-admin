import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { UploadFileState } from '../types';

@Component({
  selector: 'emr-file',
  exportAs: 'emrFile',
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-file',
    '[class.has-error]': "state() === 'error'"
  }
})
export class FileComponent {
  name = input.required();
  size = input();
  progress = input(0, {
    transform: numberAttribute
  });
  progressingMessage = input();
  errorMessage = input();
  remainingTime = input();
  state = input<UploadFileState>('uploading');
}

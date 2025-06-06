import { Component } from '@angular/core';
import { AvatarComponent } from '@elementar-ui/components/avatar';
import { CardOverlayComponent, CardOverlayContainerDirective } from '@elementar-ui/components/card-overlay';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardImage, MatCardSubtitle, MatCardTitle
} from '@angular/material/card';

@Component({
  selector: 'app-card-overlay-with-translate-example',
  imports: [
    AvatarComponent,
    CardOverlayComponent,
    CardOverlayContainerDirective,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardImage,
    MatCardSubtitle,
    MatCardTitle
  ],
  templateUrl: './card-overlay-with-translate-example.component.html',
  styleUrl: './card-overlay-with-translate-example.component.scss'
})
export class CardOverlayWithTranslateExampleComponent {

}

import { Component, viewChild } from '@angular/core';
import { MatDrawerMode, MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-basic-sidenav-example',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatButton,
    MatSidenavContent,
    MatRadioButton,
    ReactiveFormsModule,
    MatRadioGroup
  ],
  templateUrl: './basic-sidenav-example.component.html',
  styleUrl: './basic-sidenav-example.component.scss'
})
export class BasicSidenavExampleComponent {
  readonly sidenav = viewChild.required(MatSidenav);

  reason = '';
  mode = new FormControl('over' as MatDrawerMode);

  async close(reason: string) {
    this.reason = reason;
    await this.sidenav().close();
  }
}

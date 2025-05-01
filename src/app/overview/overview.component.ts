import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardFooter } from '@angular/material/card';
import { OrderByPipe } from '@elementar-ui/components/core';

@Component({
  imports: [
    RouterLink,
    MatCard,
    MatCardContent,
    MatCardFooter,
    OrderByPipe
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  items = signal([
    {
      routerLink: '/components/divider',
      imageUrl: 'assets/overview/divider.svg',
      name: 'Divider'
    },
    {
      routerLink: '/components/command-bar',
      imageUrl: 'assets/overview/command-bar.svg',
      name: 'Command Bar'
    },
    {
      routerLink: '/components/table',
      imageUrl: 'assets/overview/table.svg',
      name: 'Table'
    },
    {
      routerLink: '/components/dataview',
      imageUrl: 'assets/overview/data-view.svg',
      name: 'Data View'
    },
    {
      routerLink: '/components/announcement',
      imageUrl: 'assets/overview/announcement.svg',
      name: 'Announcement'
    },
    {
      routerLink: '/components/expansion-panel',
      imageUrl: 'assets/overview/accordion.svg',
      name: 'Expansion Panel'
    },
    {
      routerLink: '/components/dialog',
      imageUrl: 'assets/overview/dialog.svg',
      name: 'Dialog'
    },
    {
      routerLink: '/forms/radio',
      imageUrl: 'assets/overview/radio.svg',
      name: 'Radio'
    },
    {
      routerLink: '/components/list',
      imageUrl: 'assets/overview/list.svg',
      name: 'List'
    },
    {
      routerLink: '/components/datepicker',
      imageUrl: 'assets/overview/datepicker.svg',
      name: 'Date Picker'
    },
    {
      routerLink: '/components/number-input',
      imageUrl: 'assets/overview/number-input.svg',
      name: 'Number Input'
    },
    {
      routerLink: '/components/skeleton',
      imageUrl: 'assets/overview/skeleton.svg',
      name: 'Skeleton'
    },
    {
      routerLink: '/components/upload',
      imageUrl: 'assets/overview/upload.svg',
      name: 'Upload'
    },
    {
      routerLink: '/components/filter-builder',
      imageUrl: 'assets/overview/filter-builder.svg',
      name: 'Filter Builder'
    },
    {
      routerLink: '/forms/input',
      imageUrl: 'assets/overview/input.svg',
      name: 'Input'
    },
    {
      routerLink: '/components/badge',
      imageUrl: 'assets/overview/badge.svg',
      name: 'Badge'
    },
    {
      routerLink: '/components/snackbar',
      imageUrl: 'assets/overview/snackbar.svg',
      name: 'Snackbar'
    },
    {
      routerLink: '/components/progress-spinner',
      imageUrl: 'assets/overview/spinner.svg',
      name: 'Progress Spinner'
    },
    {
      routerLink: '/components/stepper',
      imageUrl: 'assets/overview/stepper.svg',
      name: 'Stepper'
    },
    {
      routerLink: '/forms/slide-toggle',
      imageUrl: 'assets/overview/slide-toggle.svg',
      name: 'Slide Toggle'
    },
  ]);
}

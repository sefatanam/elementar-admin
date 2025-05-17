import { TemplateRef } from '@angular/core';

export type PanelPosition = 'left' | 'right';

export interface SidePanelTabConfig {
  id: string;
  label: string;
  icon?: string | TemplateRef<any>;
  content: TemplateRef<any>;
}

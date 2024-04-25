import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent {
  title = 'Embedded Platform';

  constructor(private iconSetService: IconSetService) {
    this.iconSetService.icons = { ...iconSubset };
  }
}

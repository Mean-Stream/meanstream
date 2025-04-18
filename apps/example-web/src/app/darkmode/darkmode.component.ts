import {Component} from '@angular/core';
import {ThemeService} from '@meanstream/ngbx';

@Component({
  selector: 'nestx-darkmode',
  templateUrl: './darkmode.component.html',
  styleUrls: ['./darkmode.component.css'],
  standalone: false,
})
export class DarkmodeComponent {
  sizes = [undefined, 'sm', 'md', 'lg'] as const;
  styles = [undefined, 'icon', 'label'] as const;

  constructor(
    public themeService: ThemeService,
  ) {
  }
}

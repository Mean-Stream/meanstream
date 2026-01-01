import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {DarkSwitchComponent, ThemeService, ThemeSwitchComponent} from '@meanstream/ngbx';

@Component({
  selector: 'nestx-darkmode',
  templateUrl: './darkmode.component.html',
  styleUrls: ['./darkmode.component.css'],
  imports: [
    DarkSwitchComponent,
    ThemeSwitchComponent,
    AsyncPipe,
  ],
})
export class DarkmodeComponent {
  sizes = [undefined, 'sm', 'md', 'lg'] as const;
  styles = [undefined, 'icon', 'label'] as const;

  protected themeService = inject(ThemeService);
}

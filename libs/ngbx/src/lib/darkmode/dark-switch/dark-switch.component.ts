import {AsyncPipe} from '@angular/common';
import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Subject} from 'rxjs';

import {ThemeService} from '../theme.service';

/**
 * A simple boolean toggle for enabling dark mode.
 * Enabling the toggle sets the theme to `dark`, while disabling sets it to `light`.
 */
@Component({
  selector: 'ngbx-darkmode-switch',
  templateUrl: './dark-switch.component.html',
  styleUrls: ['./dark-switch.component.scss'],
  imports: [FormsModule, AsyncPipe],
})
export class DarkSwitchComponent {
  theme$: Subject<string | null> = inject(ThemeService).theme$;
}

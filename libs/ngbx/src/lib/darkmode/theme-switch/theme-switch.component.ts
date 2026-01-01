import {Component, inject, Input} from '@angular/core';

import {Subject} from 'rxjs';

import {ThemeService} from '../theme.service';

/**
 * A tri-state toggle button for switching between `light`, `auto` and `dark` theme.
 * Size and style (icon vs label) are configurable.
 */
@Component({
  selector: 'ngbx-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss'],
  standalone: false,
})
export class ThemeSwitchComponent {
  /**
   * The size of the toggle button.
   *
   * - `sm` and `lg` translate to Bootstrap's `.btn-sm` and `.btn-lg`, respectively.
   * - `md` is the default and translates to just `.btn`.
   *
   * @see https://getbootstrap.com/docs/4.5/components/buttons/#sizes
   */
  @Input() size?: 'sm' | 'md' | 'lg';

  /**
   * The style of the button labels.
   *
   * - `icon` is the default and displays the Octicons for sun (light mode), telescope (auto mode) and moon (dark mode),
   * while also adding invisible text for screen readers.
   * - `label` uses textual labels instead (Light, Auto, Dark).
   *
   * @see https://primer.style/octicons/sun-16
   * @see https://primer.style/octicons/telescope-16
   * @see https://primer.style/octicons/moon-16
   */
  @Input() style?: 'icon' | 'label';

  theme$: Subject<string | null> = inject(ThemeService).theme$;
}

# Darkmode

An Angular wrapper for [bootstrap-darkmode](https://github.com/Clashsoft/bootstrap-darkmode).
For previous versions check out [ng-bootstrap-darkmode](https://github.com/Clashsoft/ng-bootstrap-darkmode).

This library is compatible with both bootstrap-darkmode and native Bootstrap color modes (introduced in 5.3).

## Setup with bootstrap-darkmode (Optional)

Follow the steps to [Install `bootstrap-darkmode` with npm/yarn/pnpm](https://github.com/Clashsoft/bootstrap-darkmode#with-npmyarnpnpm).

Include darkmode css (in `styles.scss`):

```scss
@import "~bootstrap-darkmode/scss/darktheme";
```

Alternatively, if you are not using SCSS, add the following in `angular.json` under `projects.<yourProject>.architect.build.options.styles`:

```json5
"styles": [
  // ...
  "node_modules/bootstrap-darkmode/dist/darktheme.css"
]
```

As of version 0.13.0, this library targets [Bootstrap 5.3 Color Modes](https://getbootstrap.com/docs/5.3/customize/color-modes/) instead of `bootstrap-darkmode` by default.
To use `bootstrap-darkmode` instead, you need to provide the `THEME_ATTRIBUTE` token in your module:

```typescript
import {NgbxDarkmodeModule, THEME_ATTRIBUTE} from '@mean-stream/ngbx';

@NgModule({
  imports: [
    // ...
    NgbxDarkmodeModule,
  ],
  // ...
  providers: [
    // ...
    {
      provide: THEME_ATTRIBUTE,
      useValue: 'data-theme',
    },
  ],
})
export class AppModule {
}
```

## Usage

### Module Import

```typescript
import {NgbxDarkmodeModule} from '@mean-stream/ngbx';

@NgModule({
  imports: [
    // ...
    NgbxDarkmodeModule,
  ],
  // ...
})
export class AppModule {
}
```

### Theme Switcher

To include the theme switcher, which allows selections between light, dark and automatic (user agent preference) mode:

```html
<ngbx-theme-switch></ngbx-theme-switch>
```

The theme switcher can be customized with the optional `[size]` and `[style]` attributes:

```html
<ngbx-theme-switch size="sm"></ngbx-theme-switch>
<ngbx-theme-switch size="md"></ngbx-theme-switch>
<ngbx-theme-switch size="lg"></ngbx-theme-switch>
<ngbx-theme-switch [size]="userPrefersLargeElements ? 'lg' : 'md'"></ngbx-theme-switch>

<ngbx-theme-switch style="icon"></ngbx-theme-switch>
<ngbx-theme-switch style="label"></ngbx-theme-switch>
<ngbx-theme-switch [style]="userPrefersLabelsOverIcons ? 'label' : 'icon'"></ngbx-theme-switch>
```

An outdated alternative is the dark mode switch, which does not support automatic mode:

```html
<ngbx-darkmode-switch></ngbx-darkmode-switch>
```

### Subscribing to the Theme

```typescript
import {ThemeService} from '@mean-stream/ngbx';

@Injectable()
export class MyService {
  constructor(
    themeService: ThemeService,
  ) {
    themeService.theme$.subscribe(theme => console.log(theme));
  }
}
```

### Configuring Persistence

By default, this library persists the currently selected theme using the key `theme` in `localStorage`.
You can customize how this behaviour using dependency injection.
Just provide the `THEME_SAVER` and `THEME_LOADER` functions in your module:

```typescript
import {of} from 'rxjs';

import {NgbxDarkmodeModule, THEME_LOADER, THEME_SAVER} from '@mean-stream/ngbx';

@NgModule({
  imports: [
    // ...
    NgbxDarkmodeModule,
  ],
  providers: [
    {
      provide: THEME_LOADER,
      useValue: () => of('light'),
    },
    {
      provide: THEME_SAVER,
      useValue: (theme) => console.log('saving', theme),
    },
  ],
  // ...
})
export class AppModule {
}
```

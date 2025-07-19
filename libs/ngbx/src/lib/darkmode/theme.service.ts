
import {Inject, Injectable, DOCUMENT} from '@angular/core';

import {BehaviorSubject, fromEvent, Observable, of, Subject, switchMap, tap} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {
  ActiveTheme,
  DetectedTheme,
  Theme,
  THEME_ATTRIBUTE,
  THEME_LOADER,
  THEME_SAVER,
  ThemeLoader,
  ThemeSaver
} from './theme-loader';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme = new BehaviorSubject<Theme | null>(null);

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(THEME_ATTRIBUTE) themeAttribute: string,
    @Inject(THEME_LOADER) themeLoader: ThemeLoader,
    @Inject(THEME_SAVER) themeSaver: ThemeSaver,
  ) {
    themeLoader().subscribe(theme => this._theme.next(theme));

    this.theme$.pipe(
      tap(theme => themeSaver(theme)),
      switchMap(theme => this.activeThemeFrom$(theme)),
    ).subscribe(theme => {
      if (theme) {
        document.body.setAttribute(themeAttribute, theme);
      } else {
        document.body.removeAttribute(themeAttribute);
      }
    });
  }

  /**
   * @return the current theme
   */
  get theme(): Theme {
    return this._theme.getValue();
  }

  /**
   * @param value
   *  the new theme
   */
  set theme(value: Theme) {
    this._theme.next(value);
  }

  /**
   * @return a subject representing the currently set theme (may be auto)
   */
  get theme$(): Subject<Theme> {
    return this._theme;
  }

  /**
   * @return the currently active theme (auto is resolved to dark or light depending on the preferred color scheme)
   */
  get activeTheme(): ActiveTheme {
    const theme = this.theme;
    return theme === 'auto' ? this.detectedTheme : theme;
  }

  /**
   * @return an observable version of {@link activeTheme} that automatically updates on changes
   * @see detectedTheme$
   */
  get activeTheme$(): Observable<ActiveTheme> {
    return this.theme$.pipe(
      switchMap(theme => this.activeThemeFrom$(theme)),
    );
  }

  private activeThemeFrom$(theme: Theme) {
    return theme === 'auto' ? this.detectedTheme$ : of(theme);
  }

  /**
   * @return `dark` if the user agent prefers dark color scheme, `light` otherwise
   */
  get detectedTheme(): DetectedTheme {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * @return an observable version of {@link detectedTheme} that automatically updates on changes, e.g. when the user
   * changes their operating system theme preference, or it switches depending on day/night.
   */
  get detectedTheme$(): Observable<DetectedTheme> {
    if (typeof window === 'undefined') {
      return of('light');
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return fromEvent<MediaQueryListEvent>(mediaQuery, 'change').pipe(
      map(event => event.matches),
      startWith(mediaQuery.matches),
      map(matches => matches ? 'dark' : 'light'),
    );
  }
}

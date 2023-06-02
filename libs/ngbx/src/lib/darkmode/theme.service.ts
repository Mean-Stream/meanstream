import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';

import {BehaviorSubject, fromEvent, Observable, of, Subject, switchMap} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {DetectedTheme, THEME_ATTRIBUTE, THEME_LOADER, THEME_SAVER, ThemeLoader, ThemeSaver} from './theme-loader';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _theme = new BehaviorSubject<string | null>(null);

  constructor(
    @Inject(DOCUMENT) document: Document,
    @Inject(THEME_ATTRIBUTE) themeAttribute: string,
    @Inject(THEME_LOADER) themeLoader: ThemeLoader,
    @Inject(THEME_SAVER) themeSaver: ThemeSaver,
  ) {
    themeLoader().subscribe(this._theme);

    this._theme.pipe(
      switchMap(theme => theme === 'auto' ? this.detectedTheme$ : of(theme)),
    ).subscribe(theme => {
      if (theme) {
        document.body.setAttribute(themeAttribute, theme);
      } else {
        document.body.removeAttribute(themeAttribute);
      }

      themeSaver(theme);
    });
  }

  /**
   * @return a subject representing the currently active theme
   */
  get theme$(): Subject<string | null> {
    return this._theme;
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

  /**
   * @return the current theme
   */
  get theme(): string | null {
    return this._theme.getValue();
  }

  /**
   * @param value
   *  the new theme
   */
  set theme(value: string | null) {
    this._theme.next(value);
  }
}

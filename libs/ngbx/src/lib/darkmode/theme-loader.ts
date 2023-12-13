import {InjectionToken} from '@angular/core';
import {fromEvent, Observable, of} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';

export type Theme = 'auto' | ActiveTheme;
export type ActiveTheme = 'dark' | 'light' | string | null;
export type DetectedTheme = 'dark' | 'light';

export type ThemeLoader = () => Observable<Theme>;
export type ThemeSaver = (theme: Theme) => void;

export const LOCAL_STORAGE_THEME_LOADER: ThemeLoader = () => {
  if (!globalThis.localStorage) {
    return of(null);
  }
  return fromEvent<StorageEvent>(window, 'storage').pipe(
    filter(event => event.key === 'theme' && event.storageArea === localStorage),
    map(event => event.newValue),
    startWith(localStorage.getItem('theme')),
  );
};

export const LOCAL_STORAGE_THEME_SAVER: ThemeSaver = theme => {
  if (!globalThis.localStorage) {
    return;
  }
  if (theme) {
    localStorage.setItem('theme', theme);
  } else {
    localStorage.removeItem('theme');
  }
}

export const THEME_ATTRIBUTE: InjectionToken<string> = new InjectionToken<string>('Body attribute to set in ThemeService', {
  factory: () => 'data-bs-theme',
});

/**
 * A function that loads the saved theme.
 * Defaults to loading from local storage with the key `theme`.
 */
export const THEME_LOADER: InjectionToken<ThemeLoader> = new InjectionToken<ThemeLoader>('', {
  factory: () => LOCAL_STORAGE_THEME_LOADER,
});

/**
 * A function that saves the theme.
 * Defaults to saving to local storage with the key `theme`.
 */
export const THEME_SAVER: InjectionToken<ThemeSaver> = new InjectionToken<ThemeSaver>('', {
  factory: () => LOCAL_STORAGE_THEME_SAVER,
});

import {InjectionToken} from '@angular/core';
import {fromEvent, Observable, of} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';

export type DetectedTheme = 'dark' | 'light';

export type ThemeLoader = () => Observable<string | null>;
export type ThemeSaver = (theme: string | null) => void;

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

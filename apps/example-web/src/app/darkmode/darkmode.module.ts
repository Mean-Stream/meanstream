import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbxDarkmodeModule, THEME_LOADER, THEME_SAVER} from '@nestx/ngbx';
import {of} from 'rxjs';
import {DarkmodeComponent} from './darkmode.component';

@NgModule({
  imports: [
    CommonModule,
    NgbxDarkmodeModule,
    DarkmodeComponent,
  ],
  exports: [DarkmodeComponent],
  providers: [
    {
      provide: THEME_LOADER,
      useValue: () => of('loaded-light'),
    },
    {
      provide: THEME_SAVER,
      useValue: (theme: string) => console.log('saving', theme),
    },
  ],
})
export class DarkmodeModule {
}

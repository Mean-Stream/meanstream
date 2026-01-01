import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DarkSwitchComponent} from './dark-switch/dark-switch.component';
import {ThemeSwitchComponent} from './theme-switch/theme-switch.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DarkSwitchComponent,
    ThemeSwitchComponent,
  ],
  exports: [
    DarkSwitchComponent,
    ThemeSwitchComponent,
  ],
})
export class NgbxDarkmodeModule {
}

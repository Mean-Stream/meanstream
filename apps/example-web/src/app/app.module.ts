import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {FormsModule, ModalModule, RouteTabsModule, ToastModule} from '@nestx/ngbx';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {appRoutes} from './app.routes';
import {DarkmodeModule} from './darkmode/darkmode.module';
import {ExampleModalComponent} from './example-modal/example-modal.component';
import {FormsComponent} from './forms/forms.component';
import {ModalsComponent} from './modals/modals.component';
import {ToastsComponent} from './toasts/toasts.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {initialNavigation: 'enabledBlocking'}),
    NgbModule,
    ToastModule,
    RouteTabsModule,
    ModalModule,
    FormsModule,
    DarkmodeModule,
    ToastsComponent,
    ModalsComponent,
    ExampleModalComponent,
    FormsComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {ModalModule, RouteTabsModule, ToastModule} from '@nestx/ngbx';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {appRoutes} from './app.routes';
import {ExampleModalComponent} from './example-modal/example-modal.component';
import {ModalsComponent} from './modals/modals.component';
import {ToastsComponent} from './toasts/toasts.component';

@NgModule({
  declarations: [
    AppComponent,
    ToastsComponent,
    ModalsComponent,
    ExampleModalComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {initialNavigation: 'enabledBlocking'}),
    NgbModule,
    ToastModule,
    RouteTabsModule,
    ModalModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {RouteTabsModule, ToastModule} from '@nestx/ngbx';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {appRoutes} from './app.routes';
import {ToastsComponent} from './toasts/toasts.component';

@NgModule({
  declarations: [
    AppComponent,
    ToastsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, {initialNavigation: 'enabledBlocking'}),
    NgbModule,
    ToastModule,
    RouteTabsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}

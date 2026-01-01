import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {RouteTabsComponent} from './route-tabs.component';

@NgModule({
  imports: [
    CommonModule,
    NgbNavModule,
    RouterModule,
    RouteTabsComponent,
  ],
  exports: [
    RouteTabsComponent,
  ],
})
export class RouteTabsModule {
}

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Route} from '@angular/router';

@Component({
  selector: 'ngbx-route-tabs',
  templateUrl: './route-tabs.component.html',
  styleUrls: ['./route-tabs.component.scss'],
})
export class RouteTabsComponent {
  @Input() routes!: Route[];
  @Input() active?: string;
  @Input() newBadgeClass = 'badge text-white bg-primary bg-gradient-primary';

  constructor(
    public route: ActivatedRoute,
  ) {
  }
}

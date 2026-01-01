import {Component, inject, Input} from '@angular/core';
import {ActivatedRoute, Route, RouterLink} from '@angular/router';
import {NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLink, NgbNavLinkBase} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbx-route-tabs',
  templateUrl: './route-tabs.component.html',
  styleUrls: ['./route-tabs.component.scss'],
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    RouterLink,
  ],
})
export class RouteTabsComponent {
  @Input() routes!: Route[];
  @Input() active?: string;
  @Input() newBadgeClass = 'badge text-white bg-primary bg-gradient-primary';

  protected route = inject(ActivatedRoute);
}

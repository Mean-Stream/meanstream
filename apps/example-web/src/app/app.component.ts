import {Component} from '@angular/core';
import {appRoutes} from './app.routes';

@Component({
  selector: 'nestx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent {
  title = 'example-web';
  routes = appRoutes;
}

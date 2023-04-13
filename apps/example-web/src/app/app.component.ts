import {Component} from '@angular/core';
import {appRoutes} from './app.routes';

@Component({
  selector: 'nestx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'example-web';
  routes = appRoutes;
}

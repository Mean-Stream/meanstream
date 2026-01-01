import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'nestx-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css'],
  imports: [RouterLink, RouterOutlet],
})
export class ModalsComponent {
}

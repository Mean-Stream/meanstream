import {Route} from '@angular/router';
import {ToastsComponent} from './toasts/toasts.component';

export const appRoutes: Route[] = [
  {
    path: 'toasts',
    component: ToastsComponent,
    data: {
      title: 'Toasts',
    },
  },
];

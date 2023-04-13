import {Route} from '@angular/router';
import {ExampleModalComponent} from './example-modal/example-modal.component';
import {ModalsComponent} from './modals/modals.component';
import {ToastsComponent} from './toasts/toasts.component';

export const appRoutes: Route[] = [
  {
    path: 'toasts',
    component: ToastsComponent,
    data: {
      title: 'Toasts',
    },
  },
  {
    path: 'modals',
    component: ModalsComponent,
    data: {
      title: 'Modals',
      new: true,
    },
    children: [
      {
        path: 'edit/:id',
        component: ExampleModalComponent,
      },
    ],
  },
];

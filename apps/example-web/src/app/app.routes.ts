import {Route} from '@angular/router';
import {ExampleModalComponent} from './example-modal/example-modal.component';
import {FormsComponent} from './forms/forms.component';
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
    },
    children: [
      {
        path: 'edit/:id',
        component: ExampleModalComponent,
      },
    ],
  },
  {
    path: 'forms',
    component: FormsComponent,
    data: {
      title: 'Forms',
      new: true,
    },
  },
];

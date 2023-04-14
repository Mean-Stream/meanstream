import {Route} from '@angular/router';
import {DarkmodeComponent} from './darkmode/darkmode.component';
import {ExampleModalComponent} from './example-modal/example-modal.component';
import {FormsComponent} from './forms/forms.component';
import {ModalsComponent} from './modals/modals.component';
import {ToastsComponent} from './toasts/toasts.component';

export const appRoutes: Route[] = [
  {
    path: 'darkmode',
    component: DarkmodeComponent,
    data: {
      title: 'Darkmode',
      new: true,
    },
  },
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

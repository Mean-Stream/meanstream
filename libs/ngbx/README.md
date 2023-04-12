# ngbx

Helpful additional components for [ng-bootstrap](https://ng-bootstrap.github.io).

## Installation

1. [Install ng-bootstrap](https://ng-bootstrap.github.io/#/getting-started#installation) first.
2. `npm install @meanstream/ngbx`

## Compatibility

| ngbx | Angular | ng-bootstrap | bootstrap |
|------|---------|--------------|-----------|
| 0.7  | ^15.2   | ^14          | ^5.2.3    |

For older versions, see [ng-bootstrap-ext](https://github.com/Clashsoft/ng-bootstrap-ext#compatibility).

## Usage

### Toasts

1. Import the `ToastModule`, e.g. in `AppModule`.
2. Add `<ngbx-toast-list></ngbx-toast-list>` somewhere (e.g. at the end of app component).
3. Use `ToastService` to display toasts:

```typescript
this.toastService.add({
  title: 'Important', // optional
  body: 'Hello world', // optional
  class: 'bg-primary text-white', // optional, can also be object or array
  delay: 1500, // in ms, defaults to 5000
  actions: [ // optional
    {
      name: 'Click me',
      link: ['/home'], // optional, acts as routerLink
      run: () => {
      }, // optional, do anything you want
    },
  ],
});
this.toastService.success('Account', 'Successfully created account');
this.toastService.warning('Account', 'Successfully deleted account');
this.toastService.error('Account', 'Failed to delete account', error);
```

### Modals

1. Import the `ModalModule`, e.g. in `AppModule`.
2. Create a component, e.g. `EditUserComponent`:

    ```angular2html
    <ngbx-modal #modal="modal" [back]="['../..']">
      <ng-container modal-title>
        Edit User
      </ng-container>
      <ng-container modal-body>
        <!-- User Form -->
      </ng-container>
      <ng-container modal-footer>
        <button type="button" class="btn btn-secondary" (click)="modal.close()">
          Cancel
        </button>
        <button class="btn btn-primary" (click)="save(); modal.close()">
          Save
        </button>
      </ng-container>
    </ngbx-modal>
    ```

3. Add `<router-outlet></router-outlet>` to the end of the parent component (e.g. `UserListComponent`).
4. Define child routes:

    ```typescript
    const routes: Routes = [
     {path: 'user-list', component: UserListComponent, children: [
       {path: 'edit/:id', component: EditUserComponent},
     ]},
    ];
    ```

5. Simply route to the modal from the parent component:

    ```angular2html
    <a [routerLink]="['edit', user.id]">Edit</a>
    ```

The modal will be opened and closed automatically.
The URL will be updated automatically.

Modals support the following options:

- `back`: An array for routing when the modal is closed. Example: `['../..']`
- `backOptions` (optional): Options for routing when the modal is closed. Defaults to be relative to the `ActivatedRoute`.
- `size`: Size of the modal (`sm`, `lg`, `xl`, or any string). Passed to the `NgbModal` component.
- `scrollable`: Whether the modal should be scrollable. Passed to the `NgbModal` component.
- `locked`: Disables the close button, ESC and outside clicks.
- `modalClose` (event): Emitted when the modal is closed or dismissed.

### Route Tabs

1. Import the `RouteTabsModule`, e.g. in `AppModule`.
2. Define or export `routes` from your `*RoutingModule`.
   Add `data` to define `title`, `icon` (optional, CSS class) and `new` (optional, boolean):

   ```typescript
   const routes: Routes = [
     {path: 'foo', component: FooComponent, data: {title: 'Foo'}},
     {path: 'bar', component: BarComponent, data: {title: 'Bar', icon: 'bi-bar-chart'}},
     {path: 'baz', component: BazComponent, data: {title: 'Baz', new: true}},
   ];
   ```

3. Simply use the `ngbx-route-tabs` component:

    ```angular2html
    <ngbx-route-tabs [routes]="routes">
    </ngbx-route-tabs>
    ```

Route Tabs support the following options:

- `routes`: An array of routes.
- `active`: The route to be active.
- `newBadgeClass`: A CSS class for the "new" badge. Defaults to `badge text-white bg-primary bg-gradient-primary`.

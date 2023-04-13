# Modals

## Setup

Import the `ModalModule`, e.g. in `AppModule`.

## Usage

Create a component, e.g. `EditUserComponent`:

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

Add `<router-outlet></router-outlet>` to the end of the parent component (e.g. `UserListComponent`).

Define child routes:

```typescript
const routes: Routes = [
 {path: 'user-list', component: UserListComponent, children: [
   {path: 'edit/:id', component: EditUserComponent},
 ]},
];
```

Simply route to the modal from the parent component:

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

For a live example, see [Modals](/apps/example-web/src/app/modals) and [Modals](/apps/example-web/src/app/example-modal).

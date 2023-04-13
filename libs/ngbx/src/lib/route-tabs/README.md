# Route Tabs

## Setup

Import the `RouteTabsModule`, e.g. in `AppModule`.

## Usage

Define or export `routes` from your `*RoutingModule`.
Add `data` to define `title`, `icon` (optional, CSS class) and `new` (optional, boolean):

```typescript
const routes: Routes = [
  {path: 'foo', component: FooComponent, data: {title: 'Foo'}},
  {path: 'bar', component: BarComponent, data: {title: 'Bar', icon: 'bi-bar-chart'}},
  {path: 'baz', component: BazComponent, data: {title: 'Baz', new: true}},
];
```

Add the fields to your component:

```ts
export class MyComponent {
  routes = routes; // to make them available in the template
}
```

Simply use the `ngbx-route-tabs` component:

```angular2html
<ngbx-route-tabs [routes]="routes"></ngbx-route-tabs>
```

Route Tabs support the following options:

- `routes`: An array of routes.
- `active`: The route to be active.
- `newBadgeClass`: A CSS class for the "new" badge. Defaults to `badge text-white bg-primary bg-gradient-primary`.

For a live example, see [Example App](/apps/example-web/src/app).

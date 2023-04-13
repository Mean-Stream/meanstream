# Toasts

## Setup

1. Import the `ToastModule`, e.g. in `AppModule`.
2. Add `<ngbx-toast-list></ngbx-toast-list>` somewhere (e.g. at the end of app component). 

## Usage

Use `ToastService` to display toasts:

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
this.toastService.warn('Account', 'Successfully deleted account');
this.toastService.error('Account', 'Failed to delete account', error);
```

For a live example, see [Toasts](/apps/example-web/src/app/toasts).

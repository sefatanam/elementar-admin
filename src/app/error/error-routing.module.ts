import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'internal-server-error',
    title: 'Internal Server Error',
    loadComponent: () =>
      import('./internal-server-error/internal-server-error.component').then(
        c => c.InternalServerErrorComponent
      ),
  },
  {
    path: 'access-denied',
    title: 'Access Denied',
    loadComponent: () =>
      import('./access-denied/access-denied.component').then(
        c => c.AccessDeniedComponent
      ),
  },
  {
    path: 'not-found-1',
    title: 'Not Found',
    loadComponent: () => import('./not-found-1/not-found-1.component').then(c => c.NotFound1Component)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}

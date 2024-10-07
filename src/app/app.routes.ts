import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'posts',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/list-post/list-post.component').then(
        (m) => m.ListPostComponent
      ),
  },
  {
    path: 'posts/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/post-detail/post-detail.component').then(
        (m) => m.PostDetailComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];

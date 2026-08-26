import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Requests } from './features/requests/requests';
import { RequestDetails } from './features/request-details/request-details';

import { LayoutComponent } from './shared/components/layout/layout';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'requests',
        component: Requests
      },

      {
        path: 'requests/:id',
        component: RequestDetails
      }

    ]
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];
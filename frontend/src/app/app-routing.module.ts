import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import pages
import { LoginComponent } from './pages/auth/login/login.component';
import { GuestGuard } from './guards/guest.guard';
import { P404Component } from './pages/errors/404.component';
import { DefaultLayoutComponent } from './pages/layouts/default-layout';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
    data: { pageTitle: 'Login' },
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },

  { path: '**', component: P404Component, data: { pageTitle: 'Not Found' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

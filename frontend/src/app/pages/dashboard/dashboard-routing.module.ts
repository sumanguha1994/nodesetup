import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MembersComponent } from './members/members.component';

const routes: Routes = [
  {
    path: '',
    data: { pageTitle: 'Dashboard' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, data: { pageTitle: 'Home' } },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { pageTitle: 'Profile' },
      },
      {
        path: 'members',
        component: MembersComponent,
        data: {
          pageTitle: 'Employees',
          // MemberType: { name: 'Employee' },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

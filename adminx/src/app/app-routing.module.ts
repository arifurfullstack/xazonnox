import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {environment} from '../environments/environment';
import {userAuthGuard} from './auth-guard/user-auth.guard';
import {userAuthStateGuard} from './auth-guard/user-auth-state.guard';
import { MatIconModule } from '@angular/material/icon';
const routes: Routes = [
  {
    path: environment.adminLoginUrl,
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
    canActivate: [userAuthStateGuard]
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/password-reset/password-reset.module').then(m => m.PasswordResetModule),
    // canActivate: [userAuthStateGuard]
  },
  {
    path: environment.adminBaseUrl,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [userAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,
    MatIconModule,
  ]
})
export class AppRoutingModule {
}

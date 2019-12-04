import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'trail/form', loadChildren: './trail/form/form.module#FormPageModule' },
  { path: 'trail/map', loadChildren: './trail/map/map.module#MapPageModule' },
  { path: 'orientation/form', loadChildren: './orientation/form/form.module#FormPageModule' },
  { path: 'orientation/map', loadChildren: './orientation/map/map.module#MapPageModule' },
  { path: 'perso', loadChildren: './perso/perso/perso.module#PersoPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

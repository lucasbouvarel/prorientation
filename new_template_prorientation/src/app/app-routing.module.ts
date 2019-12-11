import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'Trail',
    loadChildren: () => import('./pages/trail/trail.module').then( m => m.TrailPageModule)
  },
  {
    path: 'orientation',
    loadChildren: () => import('./pages/orientation/orientation.module').then( m => m.OrientationPageModule)
  },
  {
    path: 'user-space',
    loadChildren: () => import('./pages/user-space/user-space.module').then( m => m.UserSpacePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

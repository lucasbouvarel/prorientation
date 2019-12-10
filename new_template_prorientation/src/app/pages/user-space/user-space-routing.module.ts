import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSpacePage } from './user-space.page';

const routes: Routes = [
  {
    path: '',
    component: UserSpacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSpacePageRoutingModule {}

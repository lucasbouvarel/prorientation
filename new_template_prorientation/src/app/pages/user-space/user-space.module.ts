import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSpacePageRoutingModule } from './user-space-routing.module';

import { UserSpacePage } from './user-space.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSpacePageRoutingModule
  ],
  declarations: [UserSpacePage]
})
export class UserSpacePageModule {}

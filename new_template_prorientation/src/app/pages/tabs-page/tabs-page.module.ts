import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { TrailPageModule } from '../trail/trail.module';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TabsPageRoutingModule,
    TrailPageModule,
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }

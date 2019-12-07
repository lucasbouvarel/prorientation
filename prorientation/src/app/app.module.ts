import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';
import { OrientationModule } from './orientation/orientation.module'
import { TrailModule } from './trail/trail.module'
import { PersoModule } from './perso/perso.module'

import { environment } from 'src/environments/environment';
import { AuthenticateService } from './auth/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {AuthModule } from './auth/auth.module'

import * as firebase from 'firebase';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot(), OrientationModule, TrailModule, PersoModule, AuthModule,AngularFireAuthModule],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticateService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

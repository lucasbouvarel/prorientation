import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private  authService:  AuthService, private router: Router, ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let isLogged: any;

    this.authService.isLoggedIn().subscribe((value) => {
      isLogged = value;
    });

    if (!isLogged) {
      this.router.navigate(["login"]);
      return false;
    }
    return true;
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: UserService
  ) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (!this.auth.loggedIn()) {
        this.router.navigate(['']);
        return false;
      }
        return true;
    }
}

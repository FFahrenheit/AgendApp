import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SesionesService } from '../services/sesiones.service';

@Injectable({
  providedIn: 'root'
})
export class SesionesGuard implements CanActivate {
  constructor(private sesionesService : SesionesService,
              private router          : Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      if(! this.sesionesService.isLogged()){
        this.router.navigate(['login']);
      }
      return true;
  }

}

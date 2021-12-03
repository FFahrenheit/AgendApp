import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SesionesService {

  private authUser : User = null;
  private error : string = 'Error de servicio';

  constructor(private http    : HttpClient,
              private router  : Router) { }

  public login(correo : string, contraseña : string){
    const body = {
      correo, 
      contraseña
    };
    return this.http.post<any>('/api/v1/sesiones', 
      body).pipe(
        map(resp => {
          console.log(resp);
          switch(resp['code']){
            case 'ok':
              localStorage.setItem('id', resp['id']);
              localStorage.setItem('nombre', resp['nombre']);
              this.authUser = {
                id: localStorage.getItem('id'),
                nombre: localStorage.getItem('nombre')
              };
              return true;
            case 'no':
              this.error = 'Credenciales incorrectas. Verifique sus datos';
              return false;
            case 'error':
              this.error = 'Ha ocurrido un error en el servidor';
              return false;
          }
        }),
        catchError(error => {
          console.error(error);
          this.error = 'Error con el servidor';
          return of(false);
        })
      );
  }

  public getError() : string{
    return this.error;
  }

  public isLogged() : boolean{
    if(this.authUser != null){
      return true;
    }
    if(this.isValid('id') && this.isValid('nombre')){
      this.authUser = {
        id: localStorage.getItem('id'),
        nombre: localStorage.getItem('nombre')
      };
      return true;
    }
    return false;
  }

  private isValid(item : string) : boolean{
    const value = localStorage.getItem(item);
    return typeof value !== 'undefined' && value && value != '';
  }

  public getLoggedUser() : User{
    return this.authUser;
  }

  public logout() : void{
    this.authUser = null;
    localStorage.removeItem('id');
    localStorage.removeItem('nombre');
    this.router.navigate(['login']);
  }
}

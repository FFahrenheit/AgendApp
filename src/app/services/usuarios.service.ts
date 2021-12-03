import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private error : string = 'Error de servicio';

  constructor(private http : HttpClient) { }

  public registro(correo : string, nombre: string, contraseña : string){
    const body = {
      correo,
      nombre, 
      contraseña
    };
    return this.http.post<any>('/api/v1/usuarios', 
      body).pipe(
        map(resp => {
          console.log(resp);
          switch(resp['code']){
            case 'ok':
              return true;
            case 'existe':
              this.error = 'El usuario ya está registrado en el sistema';
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
}

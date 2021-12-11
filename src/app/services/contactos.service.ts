import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Contacto } from '../interfaces/contacto.interface';
import { SesionesService } from './sesiones.service';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  public contactos = new Subject<Contacto[]>();
  public contacto = new Subject<Contacto>();

  private error : string = 'Error de servicio';
  private id : string;

  constructor(private http            : HttpClient,
              private sesionesService : SesionesService) { 
                this.getUserId();
              }

  private getUserId() : void{
    this.id = this.sesionesService.getLoggedUser()?.id;
    console.log('Auth user ' + this.id);
  }
  public cargarContactos(){
    this.getUserId();
    this.http.get<Contacto[]>(`/api/v1/usuarios/${ this.id }/contactos`)
        .subscribe(data => {
          this.contactos.next(data);
        });
  }

  public cargarContacto(id : string){
    this.http.get<Contacto>(`/api/v1/contactos/${ id }`)
        .subscribe(data => {
          this.contacto.next(data);
        });
  }

  public eliminarContacto(id : string){
    return this.http.delete(`/api/v1/contactos/${ id }`)
               .pipe(
                 map(resp=>{
                  console.log(resp);
                  switch(resp['code']){
                    case 'ok':
                      return true;
                    case 'error':
                      this.error = 'No se ha podido eliminar el contacto';
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

  public agregarContacto(body : any){
    return this.http.post('/api/v1/contactos', body)
    .pipe(
      map(resp=>{
       console.log(resp);
       switch(resp['code']){
         case 'ok':
           return true;
         case 'no':
           this.error = 'No se pudo agregar el contacto. Verifique los datos';
           return false;
         case 'error':
           this.error = 'No se ha podido agregar el contacto';
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

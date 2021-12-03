import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contacto } from '../interfaces/contacto.interface';
import { SesionesService } from './sesiones.service';

@Injectable({
  providedIn: 'root'
})
export class ContactosService {
  public contactos = new Subject<Contacto[]>();
  private id : string;

  constructor(private http            : HttpClient,
              private sesionesService : SesionesService) { 
                this.id = sesionesService.getLoggedUser().id;
              }

  public cargarContactos(){
    this.http.get<Contacto[]>(`/api/v1/usuarios/${ this.id }/contactos`)
        .subscribe(data => {
          this.contactos.next(data);
        });
  }
}

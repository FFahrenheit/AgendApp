import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Contacto } from '../interfaces/contacto.interface';
import { User } from '../interfaces/user.interface';
import { ContactosService } from '../services/contactos.service';
import { SesionesService } from '../services/sesiones.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  public user : User;
  public contactos : Contacto[] = [];

  constructor(private sesionesService   : SesionesService,
              private alertController   : AlertController,
              private router            : Router,
              private contactosService  : ContactosService) {}

  ngOnInit(){
    this.user = this.sesionesService.getLoggedUser();
    this.contactosService.contactos.subscribe(contactos => {
      this.contactos = contactos;
    });
    this.contactosService.cargarContactos();
  }

  public async onLogout(){
    console.log('Cerrando sesión');
    await this.confirmLogout();
  }

  private async confirmLogout(){
    await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Desea cerrar su sesión?',
      buttons: [
        {
          text: 'Confirmar', handler: _ => {
            this.sesionesService.logout();
          }
        },
        {
          text: 'Cancelar'
        }
      ]
    }).then(res => res.present());
  }

  public addContact() : void{
    this.router.navigate(['new']);
  }

  public seeDetails(id : number) : void {
    this.router.navigate(['contact', id]);
  }
}

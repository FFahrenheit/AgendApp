import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Contacto } from '../interfaces/contacto.interface';
import { ContactosService } from '../services/contactos.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  public id : string | null = '';
  public contacto : Contacto;
  public propiedades = [];
  public iconos = {
    'telefono' : 'call',
    'twitter' : 'logo-twitter',
    'facebook' : 'logo-facebook',
    'correo' : 'mail',
    'linkedin' : 'logo-linkedin'
  };

  constructor(private route             : ActivatedRoute,
              private contactosService  : ContactosService,
              private alertController   : AlertController,
              private router            : Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params=> {
      this.id = params.get('id');
    });

    this.contactosService.contacto.subscribe(contacto => {
      this.contacto = contacto;
      this.propiedades = Object.keys(this.contacto)
                               .filter(k => this.contacto[k] != '' && ! ['id', 'nombre', 'foto'].includes(k));
    });

    this.contactosService.cargarContacto(this.id);
  }

  public async eliminarContacto(){
    await this.confirmDelete();
  }

  private async confirmDelete(){
    await this.alertController.create({
      header: 'Eliminar contacto',
      message: `¿Desea eliminar a ${ this.contacto.nombre }?`,
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Confirmar', handler: _ => {
            this.contactosService.eliminarContacto(this.id)
                .subscribe(resp=> {
                  if(resp){
                    this.alert('Éxito', `Se ha eliminado a ${this.contacto.nombre}`);
                    this.contactosService.cargarContactos();
                    this.router.navigate(['home']);
                  }else{
                    this.alert('Error', this.contactosService.getError());
                  }
                }, error=>{
                  this.alert('Error', this.contactosService.getError());
                });
          }
        }
      ]
    }).then(res => res.present());
  }

  public async alert(header: string, message : string){
    await this.alertController.create({
      header: header,
      message: message,
      mode: 'ios',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    }).then(res => res.present());
  }

}

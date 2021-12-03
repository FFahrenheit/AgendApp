import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ContactosService } from '../services/contactos.service';
import { SesionesService } from '../services/sesiones.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {

  private defaultImage = 'https://d3ipks40p8ekbx.cloudfront.net/dam/jcr:3a4e5787-d665-4331-bfa2-76dd0c006c1b/user_icon.png';
  private imageGenerator = 'https://ui-avatars.com/api/?background=random&size=512&name=';
  private usuarioId : string;
  public imageUrl : string;
  

  public form : FormGroup;

  constructor(private formBuiler        : FormBuilder,
              private alertController   : AlertController,
              private contactosService  : ContactosService,
              private sesionesService   : SesionesService,
              private router            : Router) { }

  ngOnInit() {
    this.imageUrl = this.defaultImage;
    this.form = this.formBuiler.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      foto: ['', Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')],
      correo: ['', Validators.email],
      facebook: [''],
      twitter: [''],
      linkedin: ['']
    });

    this.get('nombre').valueChanges.subscribe(name => {
      const photo = this.get('foto').value;
      if(photo === '' || photo.invalid){
        if(name === ''){
          this.imageUrl = this.defaultImage;
        }else{
          name =  name.replace(' ', '+');
          this.imageUrl = this.imageGenerator + name;
        }
      }
    });

    this.get('foto').valueChanges.subscribe(photo => {
      if(photo == ''){
        const name = this.get('nombre').value;
        if(name == ''){
          this.imageUrl = this.defaultImage;
        }else{
          this.imageUrl = this.imageGenerator + name;
        }
      }
      if(this.get('foto').valid){
        this.imageUrl = photo;
      }
    });

    this.usuarioId = this.sesionesService.getLoggedUser().id;
  }

  public get(ctrl : string) : AbstractControl{
    return this.form.controls[ctrl];
  }

  public async onSave(){
    if(this.form.valid){
      await this.saveContact();
    }else{
      this.form.markAllAsTouched();
      this.alert('Faltan datos', 'Llene correctamente la información');
    }
  }

  private async saveContact(){
    await this.alertController.create({
      header: 'Guardar contacto',
      message: `¿Desea agregar a ${ this.get('nombre').value } a su lista de contactos?`,
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Confirmar', handler: _ => {
            let body = this.form.value;
            body.foto = this.imageUrl;
            body.usuarioId = this.usuarioId;
            this.contactosService.agregarContacto(body)
                .subscribe(resp=> {
                  if(resp){
                    this.alert('Éxito', `Se ha agregado a ${ this.get('nombre').value }`);
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

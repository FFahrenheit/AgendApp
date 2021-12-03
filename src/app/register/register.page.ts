import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public form : FormGroup;

  constructor(private fb              : FormBuilder,
              private usuariosService : UsuariosService,
              private alertController : AlertController,
              private router          : Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      correo: ['', Validators.compose([Validators. required, Validators.email])],
      nombre: ['', Validators.required],
      contraseña: ['', Validators.required],
      confirmar: ['', Validators.required],
    });

    this.get('confirmar').valueChanges.subscribe(c => {
      if(c !== this.get('contraseña').value){
        this.get('confirmar').setErrors({confirmar: true});
      }else{
        this.get('confirmar').setErrors(null);
      }
    });
  }
  

  public onRegister(){
    console.log(this.get('confirmar'));
    if(this.form.valid){
      this.usuariosService.registro(this.get('correo').value, this.get('nombre').value, this.get('contraseña').value)
          .subscribe(async(resp)=> {
            if(resp){
              await this.alert('Usuario registrado', 'Se ha registrado el usuario con éxito');
              await new Promise(r => setTimeout(r, 800));
              this.router.navigate(['login']);
            }else{
              await this.alert('Error al registrar', this.usuariosService.getError());
            }
          }, async(error)=> {
            await this.alert('Error al registrar', this.usuariosService.getError());
          });
    }else{
      this.form.markAllAsTouched();
      this.alert('Falta información', 'Por favor, llene el formulario');
    }
  }

  public get(ctrl : string) : AbstractControl{
    return this.form.controls[ctrl];
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

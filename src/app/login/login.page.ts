import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SesionesService } from '../services/sesiones.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public form : FormGroup;

  constructor(private fb              : FormBuilder,
              private sesionesService : SesionesService,
              private alertController : AlertController,
              private router          : Router) { }

  ngOnInit() {
    this.form = this.fb.group({
      correo: ['', Validators.required],
      contraseña: ['', Validators.required]
    });
  }

  public async onLogin(){
    console.log(this.form.value);
    if(this.form.valid){
      this.sesionesService.login(this.get('correo').value, this.get('contraseña').value)
          .subscribe(async(resp)=> {
            if(resp){
              await new Promise(r => setTimeout(r, 180));
              this.router.navigate(['home']);
            }else{
              await this.errorAlert('Error al iniciar sesión', this.sesionesService.getError());
            }
          }, async(error)=> {
            await this.errorAlert('Error al iniciar sesión', this.sesionesService.getError());
          });
    }else{
      await this.errorAlert('Falta información', 'Por favor, llene el formulario');
      this.form.markAllAsTouched();
    }
  }

  public get(ctrl : string) : AbstractControl{
    return this.form.controls[ctrl];
  }

  public async errorAlert(header: string, message : string){
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

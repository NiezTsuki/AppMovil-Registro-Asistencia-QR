import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  router = inject(Router)

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user')
  }

  //Tomar/Seleccionar Imagen

  async takeImage() {

    let user = this.user();
    let path =  `users/${user.uid}`

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Perfil')).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath =  `${user.uid}/perfil`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async res =>{

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message:'Imagen actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon:'checkmark-circle-outline'
      })
    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }).finally(() =>{
      loading.dismiss();
    })
  }


  goToEditarPerfil() {
    this.router.navigate(['/main/editar-perfil']);
  }
}



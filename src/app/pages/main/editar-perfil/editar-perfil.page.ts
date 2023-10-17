import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  newName: string;

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user')
  }

  async saveName() {
    let user = this.user();
    let path = `users/${user.uid}`;
  
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    const newName = this.newName;
  
    this.firebaseSvc.updateDocument(path, { name: newName })
      .then(async res => {
        
        user.name = newName;
  
        this.utilsSvc.saveInLocalStorage('user', user);
  
        this.utilsSvc.presentToast({
          message: 'Nombre actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        });
      })
      .catch(error => {
        console.log(error);
  
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
  

}

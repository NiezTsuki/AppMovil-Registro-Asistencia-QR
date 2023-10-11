import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController)
  toastCtrl =inject(ToastController)
  router = inject(Router)


async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto'
    });
  
  };

  //Loading//

  loading() {
    return this.loadingCtrl.create({spinner: 'crescent'})
  }

  //Toast//

  async presentToast(opts?: ToastOptions){
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //Enruta a cualquier pagina disponible//
  
  routerLink(url: string){
    return this.router.navigateByUrl(url);
  }

  //Guarda un elemento en localstorage//
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  //Obtener un elemento desde localstorage//
  getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key))
  }

}

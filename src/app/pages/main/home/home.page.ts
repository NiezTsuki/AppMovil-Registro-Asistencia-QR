import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  navCtrl = inject(NavController)

  fechaActual: string = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  ngOnInit() {
  }

  //Cerrar Sesion//
  signOut() {
    this.firebaseSvc.signOut();

  }


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user')
  }

  redirectToLink(url: string): void {
    // Puedes redirigir a la URL utilizando el NavController
    this.navCtrl.navigateForward(url);
  }

}

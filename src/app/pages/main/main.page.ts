import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    { title: 'Inicio', url: '/main/home', icon: 'home-outline' },
    { title: 'Perfil', url: '/main/perfil', icon: 'person-outline' }
  ]

  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;

    })
  }

  //Cerrar Sesión//
  signOut() {
    this.firebaseSvc.signOut();
  }


  user(): User {
    return this.utilsSvc.getFromLocalStorage('user')
  }

  //Visualizar solo para los profesores
  isProfesor(): boolean {
    const user = this.user();
    return user?.email?.endsWith('@duocuc.cl');
  }

  //Visualizar solo para los alumnos
  isAlumno(): boolean {
    const user = this.user();
    return user?.email?.endsWith('@gmail.com');
  }

}


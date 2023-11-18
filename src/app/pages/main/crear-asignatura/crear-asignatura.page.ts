import { Component } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-crear-asignatura',
  templateUrl: './crear-asignatura.page.html',
  styleUrls: ['./crear-asignatura.page.scss'],
})
export class CrearAsignaturaPage {

  nuevaAsignatura = {
    id: '',  // Agrega el campo id a tu objeto nuevaAsignatura
    nombre: '',
    imagenUrl: '',
  };

  constructor(private firebaseService: FirebaseService, private navCtrl: NavController, private router: Router, private utilsSvc: UtilsService) {}

  // Función para crear una nueva asignatura
  crearAsignatura() {
    if (this.nuevaAsignatura.nombre.trim() !== '') {
      // Generar un ID aleatorio
      this.nuevaAsignatura.id = uuidv4();

      // Agregar la nueva asignatura a la base de datos
      this.firebaseService.setDocument('asignaturas/' + this.nuevaAsignatura.id, this.nuevaAsignatura)
        .then(() => {
          this.utilsSvc.presentToast({
            message:'Asignatura creada exitosamente',
            duration: 1500,
            color: 'success',
            position: 'middle',
            icon:'checkmark-circle-outline'
          })
        }).catch(error => {
          console.log(error);
        })
        .catch(error => {
          console.error('Error al crear la asignatura', error);
        });
    } else {
      this.utilsSvc.presentToast({
        message: "Error al crear la asignatura revisa los campos",
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
      console.error('El nombre de la asignatura no puede estar vacío');
    }
  }

  goToCrearAsignatura() {
    this.router.navigate(['/main/crear-asignatura']);
  }

  handleImageSelection(event: any) {
    const file = event?.target?.files?.[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const imageUrl = e.target.result as string;
        this.nuevaAsignatura.imagenUrl = imageUrl;
      };
  
      reader.readAsDataURL(file);
    }
  }
}


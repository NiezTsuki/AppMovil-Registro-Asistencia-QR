import { Component, OnInit } from '@angular/core';
import { Asignatura, Clase } from 'src/app/models/asignaturas.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit {
  asignaturas: Asignatura[] = [];

  mostrarQR: boolean = false;

  constructor(private firebaseService: FirebaseService, private router: Router, private navCtrl: NavController) {}
  
  ngOnInit() {
    this.loadAsignaturas();
  }

  async loadAsignaturas() {
    try {
      const asignaturasSnapshot = await this.firebaseService.getAllAsignaturas();
      this.asignaturas = asignaturasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Asignatura));
    } catch (error) {
      console.error('Error al cargar las asignaturas:', error);
    }
  }

  async agregarAsignatura() {
    const nuevaAsignatura: Asignatura = {
      id: '',
      nombre: 'Nueva Asignatura',
      imagenUrl: 'URL_POR_DEFECTO',  // Puedes poner una URL predeterminada para la imagen
      clases: [], // Inicializamos la lista de clases como vacía al crear una nueva asignatura
    };

    try {
      const result = await this.firebaseService.addAsignatura(nuevaAsignatura);
      
      if (result) {
        this.loadAsignaturas();
      } else {
        console.error('Error al agregar la asignatura.');
      }
    } catch (error) {
      console.error('Error al agregar la asignatura:', error);
    }
  }

  goToCrearAsignatura() {
    this.router.navigate(['/main/crear-asignatura']);
  }

  generateAndShowQR(asignatura: Asignatura, idClase?: string): void {
    try {
      asignatura.detalleQR = this.firebaseService.generateQR(asignatura.id, idClase);
      this.mostrarQR = true;
    } catch (error) {
      console.error('Error al generar el código QR:', error);
    }
  }
}





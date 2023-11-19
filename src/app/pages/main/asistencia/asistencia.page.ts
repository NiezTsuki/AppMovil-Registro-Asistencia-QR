import { Component, OnInit } from '@angular/core';
import { Asistencia } from 'src/app/models/asistencia.model';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  asistencias: Asistencia[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    // Cargar la lista de asistencias desde Firebase
    this.firebaseService.obtenerAsistenciasUsuario().then((asistencias) => {
      this.asistencias = asistencias;
    }).catch((error) => {
      console.error('Error al obtener las asistencias:', error);
    });
  }
}
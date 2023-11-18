import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Result, BarcodeFormat } from '@zxing/library';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-escanear-qr',
  templateUrl: './escanear-qr.page.html',
  styleUrls: ['./escanear-qr.page.scss'],
})
export class EscanearQRPage implements OnInit {

  

  hasCameras: boolean;
  formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  mostrarEscaner: boolean = false;

  constructor(private alertController: AlertController, private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Verifica si hay cámaras disponibles
    this.hasCameras = navigator.mediaDevices.getUserMedia !== undefined;
  }

  iniciarEscaner(): void {
    // Cambia la visibilidad del componente del escáner al hacer clic en el botón
    this.mostrarEscaner = true;
  }

  async escanearCodigo(event: any): Promise<void> {
    // Asegúrate de que el evento contiene un resultado y obtén el texto del código QR
    const resultado: Result = event.codeResult ? event.codeResult : event;
  
    // Lógica para procesar el código QR escaneado
    const textoQR = this.obtenerTextoQR(resultado);
  
    if (textoQR) {
      console.log('Código escaneado:', textoQR);
  
      try {
        // Llama a tu servicio de asistencia para registrar la asistencia y obtén la información del estudiante
        const infoEstudiante = await this.firebaseService.registrarAsistenciaDesdeQR(textoQR);

        // Puedes utilizar la información del estudiante según sea necesario
        console.log('Información del estudiante:', infoEstudiante);

        // Resto del código...
      } catch (error) {
        console.error('Error al procesar el código QR:', error);
        // Muestra una alerta en caso de error
        await this.mostrarAlerta('Error', 'Error al procesar el código QR. Por favor, inténtalo de nuevo.');
      }
    }
  }
  
  // Resto del código...

  // Función para obtener el texto del código QR
  obtenerTextoQR(result: Result): string | null {
    if (result && result.getText) {
      return result.getText();
    } else {
      return null;
    }
  }

  // Función para mostrar una alerta
  async mostrarAlerta(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  cambiarVisibilidadEscaner(): void {
    this.mostrarEscaner = !this.mostrarEscaner;
  }

}





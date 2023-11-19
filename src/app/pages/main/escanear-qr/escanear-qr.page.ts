import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result, BarcodeFormat } from '@zxing/library';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-escanear-qr',
  templateUrl: './escanear-qr.page.html',
  styleUrls: ['./escanear-qr.page.scss'],
})
export class EscanearQRPage implements OnInit, OnDestroy {
  @ViewChild('scanner', { static: false })
  scanner: ZXingScannerComponent;

  hasCameras: boolean;
  mostrarEscaner: boolean = true;
  allowedFormats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX
    // Agrega otros formatos según sea necesario
  ];

  constructor(
    private alertController: AlertController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.hasCameras = navigator.mediaDevices.getUserMedia !== undefined;
  }

  ngOnDestroy() {
    this.scanner.ngOnDestroy();
  }

  iniciarEscaner(): void {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      // Maneja la disponibilidad de cámaras
    });

    this.scanner.camerasNotFound.subscribe(() => {
      // Maneja la falta de cámaras
    });

    this.scanner.scanComplete.subscribe((result: Result) => {
      this.escanearCodigo(result);
    });

    this.scanner.scanStart();
  }

  async escanearCodigo(result: Result): Promise<void> {
    if (result && typeof result === 'object' && 'getText' in result) {
      const textoQR = result.getText();
  
      if (textoQR) {
        console.log('Código escaneado:', textoQR);
  
        try {
          const infoEstudiante: User = await this.firebaseService.registrarAsistenciaDesdeQR(textoQR);
  
          if (infoEstudiante) {
            console.log('Información del estudiante:', infoEstudiante);
  
            // Mostrar la alerta de asistencia registrada correctamente.
            await this.mostrarAlerta('Éxito', 'Se registró la asistencia correctamente.');
  
            // Resto del código...
          } else {
            console.error('Error al procesar el código QR: No se pudo obtener la información del estudiante.');
            await this.mostrarAlerta('Error', 'Error al procesar el código QR. Por favor, inténtalo de nuevo.');
          }
        } catch (error) {
          console.error('Error al procesar el código QR:', error);
          await this.mostrarAlerta('Error', 'Error al procesar el código QR. Por favor, inténtalo de nuevo.');
        }
      }
    }
  }
  
  

  async mostrarAlerta(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  cambiarVisibilidadEscaner(): void {
    this.mostrarEscaner = !this.mostrarEscaner;
  }
}

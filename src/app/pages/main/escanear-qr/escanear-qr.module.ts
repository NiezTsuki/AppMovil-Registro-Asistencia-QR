import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EscanearQRPageRoutingModule } from './escanear-qr-routing.module';

import { EscanearQRPage } from './escanear-qr.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscanearQRPageRoutingModule,
    SharedModule,
    ZXingScannerModule
  ],
  declarations: [EscanearQRPage]
})
export class EscanearQRPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarContraPageRoutingModule } from './recuperar-contra-routing.module';

import { RecuperarContraPage } from './recuperar-contra.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarContraPageRoutingModule,
    SharedModule
  ],
  declarations: [RecuperarContraPage]
})
export class RecuperarContraPageModule {}

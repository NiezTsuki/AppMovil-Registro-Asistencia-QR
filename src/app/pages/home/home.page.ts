import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  mensaje: string = "";

  constructor(private rutaActiva : ActivatedRoute) {

    this.rutaActiva.queryParams.subscribe(params =>{

      if(params['usuario'])
      {
        this.mensaje = params['usuario']
      }

    })
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin = {
    usuario:"",
    password:""
  }

  constructor() { }

  ngOnInit() {
  }

  Ingresar() {

    console.log("Usuario" + this.formLogin.usuario)
    console.log("Contraseña" + this.formLogin.password)
  }

}

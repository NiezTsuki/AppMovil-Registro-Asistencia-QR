import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  Ingresar() {

    console.log("Usuario" + this.formLogin.usuario)
    console.log("Contraseña" + this.formLogin.password)

    let datosEnviar : NavigationExtras = {
      queryParams : {usuario:  this.formLogin.usuario}
    }

    this.router.navigate(['/home'], datosEnviar);
  }

}

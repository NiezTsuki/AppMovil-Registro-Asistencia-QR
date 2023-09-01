import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

    this.router.navigate(['/home'])
  }

}

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Usuario } from './interfaces/usuario';
import { ClienteAutenticadoComponent } from './pages/cliente-autenticado/cliente-autenticado.component';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  prod = environment.production;
  isCarregando = false;
  isLogado = false;
  loginForm = this.formBuilder.group({
    cnpj: '',
    pwd: '',
  });

  constructor(public dialog: MatDialog, private auth: AuthService, private formBuilder: FormBuilder) { }

  openDialog() {
    const dialogRef = this.dialog.open(ClienteAutenticadoComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  login(): void {
    const usuarioSenha: Usuario = this.loginForm.value;
    this.isCarregando = true;
    this.auth.login(usuarioSenha).subscribe(
      (res => { this.isCarregando = false; this.isLogado = true }),
      (err => { this.isCarregando = false; alert(err.error.erro) })
    );
  }
}

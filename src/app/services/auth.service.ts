import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsuarioSenha } from '../interfaces/usuario-senha';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuario: Usuario | undefined;

  constructor(private http: HttpClient) { }

  login(usuario: Usuario) {
    this.usuario = usuario;
    const usuarioSenha: UsuarioSenha = {login: usuario.cnpj, senha: usuario.pwd};
    console.log(usuarioSenha);
    return this.http.post(environment.urlRenave + 'login', usuarioSenha).pipe();
  }

  clienteAutenticado() {
    console.log({
      'cnpj': this.usuario?.cnpj!,
      'pwd': this.usuario?.pwd!,
    });
    const httpOptions = {
      headers: new HttpHeaders({
        'cnpj': this.usuario?.cnpj!,
        'pwd': this.usuario?.pwd!,
      })
    };
    return this.http.get(environment.urlRenave + 'renave/cliente-autenticado', httpOptions).pipe();
  }

  getUsuario(): Usuario {
    return this.usuario!;
  }

}

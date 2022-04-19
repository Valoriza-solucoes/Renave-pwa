import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-cliente-autenticado',
  templateUrl: './cliente-autenticado.component.html',
  styleUrls: ['./cliente-autenticado.component.scss']
})
export class ClienteAutenticadoComponent implements OnInit {
  usuario: Usuario | undefined;
  clienteAutenticado: any = {cnpj:"",nome:"",endereco:{cep:"",logradouro:"",complemento:"",bairro:"",municipio:{id:"",nome:"",uf:""},numero:""}};

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.clienteAutenticado().subscribe((res => this.clienteAutenticado = res));
  }

}

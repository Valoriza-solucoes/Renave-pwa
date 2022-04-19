import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { estoques } from 'src/assets/estoques';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  estoques = estoques;

  constructor(private http: HttpClient, private auth: AuthService) { }

  getEstoque() {
    return this.estoques;
  }

  getEstoqueChassi(chassi: string) {
    console.log('chassi', chassi);
    return this.estoques.find(x => x.chassi === chassi);
  }

  resEstoqueChassi(chassi: string) {

    const usuario: Usuario = this.auth.getUsuario();
    const httpOptions = {
      headers: new HttpHeaders({
        'cnpj': usuario?.cnpj!,
        'pwd': usuario?.pwd!,
      })
    };

    return this.http.get(environment.urlRenave + 'renave/estoque?chassi=' + chassi, httpOptions).pipe();
  }
}

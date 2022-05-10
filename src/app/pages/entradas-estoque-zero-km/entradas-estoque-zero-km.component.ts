import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario';

@Component({
  selector: 'app-entradas-estoque-zero-km',
  templateUrl: './entradas-estoque-zero-km.component.html',
  styleUrls: ['./entradas-estoque-zero-km.component.scss']
})
export class EntradasEstoqueZeroKmComponent implements OnInit {
  isCarregando = false;
  entradaForm: any;

  constructor(private location: Location, private formBuilder: FormBuilder, private http: HttpClient, private auth: AuthService) {
    this.entradaForm = this.formBuilder.group({
      chassi: ['', Validators.required],
      chaveNotaFiscal: ['', Validators.required],
      cpfOperadorResponsavel: ['', Validators.required],
      dataEntradaEstoque: ['', Validators.required],
      dataHoraMedicaoHodometro: ['', Validators.required],
      quilometragemHodometro: ['', Validators.required],
      valorCompra: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  voltar(): void {
    this.location.back()
  }

  onSubmit(entrada: any): void {

    const usuario: Usuario = this.auth.getUsuario();
    const httpOptions = {
      headers: new HttpHeaders({
        'cnpj': usuario?.cnpj!,
        'pwd': usuario?.pwd!,
      })
    };
    const setEntrada = {
      "chassi": entrada.chassi,
      "chaveNotaFiscal": entrada.chaveNotaFiscal,
      "cpfOperadorResponsavel": environment.cpfOperadorResponsavel,
      "dataEntradaEstoque": entrada.dataEntradaEstoque,
      "dataHoraMedicaoHodometro": entrada.dataHoraMedicaoHodometro,
      "quilometragemHodometro": entrada.quilometragemHodometro,
      "valorCompra": entrada.valorCompra
    }
    console.log(setEntrada);
    // /api/entradas-estoque-zero-km
    this.http.post(environment.urlRenave + 'renave/estoque/entrar-veiculozerokm', setEntrada, httpOptions).pipe().subscribe(res => {
      console.log('Passou com sucesso!');
      console.log(res);
      this.voltar();
    }, (err) => {
      console.log(err);
      alert('Ocorreu algum problema com sua requisição! Verifique os campos preenchidos e tente novamente.');
    });
  }

  onFileSelected() { }

}

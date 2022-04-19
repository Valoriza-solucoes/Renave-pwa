import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { EstoqueService } from 'src/app/services/estoque.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
  msg = 'Faça uma busca por chassi ou em branco para trazer todos';
  isCarregando = false;
  buscaForm = this.formBuilder.group({
    chassi: ''
  });
  usuario: Usuario | undefined;

  displayedColumns: string[] = ['estado', 'chassi', 'dataHoraEntrada', 'dataHoraSaida'];
  estoques: any = [{ id: 0, estado: "", codigoSegurancaCrv: null, numeroCrv: null, placa: null, renavam: null, chassi: "", tipoCrv: null, quilometragemHodometro: 0, dataHoraMedicaoHodometro: "", entradaEstoque: { cpfOperadorResponsavel: "", dataHora: "", chaveNotaFiscalEntrada: "", dataHoraEnvioNotaFiscalEntrada: "", numeroTermoEntradaEstoque: null, vendedor: null }, saidaEstoque: null, cancelamentoEstoque: null, restricoesVeiculo: [{ codigoTipoRestricao: "", tipoRestricao: "" }], origemPorCancelamentoEstoque: null }];
  constructor(private formBuilder: FormBuilder, private estoque: EstoqueService, private http: HttpClient, private auth: AuthService) { }

  ngOnInit(): void {
    // this.estoques = this.estoque.getEstoque();
  }

  resEstoque(): void {
    this.usuario = this.auth.getUsuario();
    const httpOptions = {
      headers: new HttpHeaders({
        'cnpj': this.usuario?.cnpj!,
        'pwd': this.usuario?.pwd!,
      })
    };
    console.log(environment.urlRenave + 'renave/estoque');
    this.http.get(environment.urlRenave + 'renave/estoque', httpOptions).pipe().subscribe((res => { console.log('passou'); this.estoques = res; }), (err => console.log(err)));
  }

  buscar() {
    this.isCarregando = true;
    const usuario: Usuario = this.auth.getUsuario();
    const httpOptions = {
      headers: new HttpHeaders({
        'cnpj': usuario?.cnpj!,
        'pwd': usuario?.pwd!,
      })
    };
    // this.http.get('http://179.108.253.246:8088/renave/estoque?chassi='+this.buscaForm.value.chassi, httpOptions).pipe().subscribe((res => console.log(res)));
    this.estoque.resEstoqueChassi(this.buscaForm.value.chassi).subscribe((res => {
      console.log(res);
      if (Array.isArray(res) && res.length > 0) {
        this.estoques = res;
      }
    }), (err => {
      console.log(err);
      this.estoques = [{ id: 0, estado: "", codigoSegurancaCrv: null, numeroCrv: null, placa: null, renavam: null, chassi: "", tipoCrv: null, quilometragemHodometro: 0, dataHoraMedicaoHodometro: "", entradaEstoque: { cpfOperadorResponsavel: "", dataHora: "", chaveNotaFiscalEntrada: "", dataHoraEnvioNotaFiscalEntrada: "", numeroTermoEntradaEstoque: null, vendedor: null }, saidaEstoque: null, cancelamentoEstoque: null, restricoesVeiculo: [{ codigoTipoRestricao: "", tipoRestricao: "" }], origemPorCancelamentoEstoque: null }];
    }), (() => this.isCarregando = false));
    // if (this.buscaForm.value.chassi) {
    //   const resultadoEstoque = this.estoque.getEstoqueChassi(this.buscaForm.value.chassi)!;
    //   console.log(resultadoEstoque);
    //   if (resultadoEstoque) {
    //     this.estoques = [resultadoEstoque];
    //   } else {
    //     this.estoques = [];
    //   }
    // } else {
    //   this.estoques = this.estoque.getEstoque();
    // }
  }

}

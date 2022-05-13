import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
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
  entrada: any = {
    chassi: '',
    chaveNotaFiscal: '',
    cpfOperadorResponsavel: '',
    dataEntradaEstoque: '',
    dataHoraMedicaoHodometro: '',
    quilometragemHodometro: null,
    valorCompra: '',
  };
  fileName = '';
  motoInline = '';

  constructor(private location: Location, private http: HttpClient, private auth: AuthService) {
  }

  ngOnInit(): void {
  }

  cancelar(): void {
    this.fileName = '';
    this.motoInline = '';
    this.entrada = {
      chassi: '',
      chaveNotaFiscal: '',
      cpfOperadorResponsavel: '',
      dataEntradaEstoque: '',
      dataHoraMedicaoHodometro: '',
      quilometragemHodometro: null,
      valorCompra: '',
    };
    let file: any = document.getElementById('file');
    file.value = '';
  }

  onSubmit(entrada: any): void {
    console.log('entrada', entrada);
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
      this.cancelar();
    }, (err) => {
      console.log(err);
      alert('Ocorreu algum problema com sua requisição! Verifique os campos preenchidos e tente novamente.');
    });
  }

  onFileSelected() {
    const inputNode: any = document.getElementById('file');
    const file = inputNode.files[0];
    this.fileName = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = reader.result;
      if (typeof (text) === 'string') {
        const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
        console.log(xmlDoc);
        // Dados da NF-e
        this.entrada.chaveNotaFiscal = xmlDoc.documentElement.getElementsByTagName("infNFe")[0].getAttribute("Id");
        this.entrada.dataEntradaEstoque = xmlDoc.documentElement.getElementsByTagName("dhEmi")[0].textContent;
        this.entrada.valorCompra = xmlDoc.documentElement.getElementsByTagName("vNF")[0].textContent;
        // Dados do veículo
        this.motoInline = xmlDoc.documentElement.getElementsByTagName("infAdProd")[0].textContent!;
        const veiculo = xmlDoc.documentElement.getElementsByTagName("veicProd")[0];
        this.entrada.chassi = veiculo.getElementsByTagName("chassi")[0].textContent;
        this.entrada.quilometragemHodometro = 0;
        this.entrada.dataHoraMedicaoHodometro = this.entrada.dataEntradaEstoque;
      }
    }
    reader.readAsText(file, 'text/xml');
  }

}

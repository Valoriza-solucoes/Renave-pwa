import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  motos: any = [];
  contador = 0;
  total = 0;

  constructor(private http: HttpClient, private auth: AuthService, private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  cancelar(): void {
    this.fileName = '';
    this.motos = '';
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

  onSubmit(entrada: any, motos: any): void {
    this.isCarregando = true;

    const usuario: Usuario = this.auth.getUsuario();
    const httpOptions = {
      headers: new HttpHeaders({
        'cnpj': usuario?.cnpj!,
        'pwd': usuario?.pwd!,
      })
    };
    const setEntrada = {
      "chassi": motos[this.contador].chassi,
      "chaveNotaFiscal": entrada.chaveNotaFiscal,
      "cpfOperadorResponsavel": environment.cpfOperadorResponsavel,
      "dataEntradaEstoque": entrada.dataEntradaEstoque,
      "dataHoraMedicaoHodometro": entrada.dataHoraMedicaoHodometro,
      "quilometragemHodometro": entrada.quilometragemHodometro,
      "valorCompra": motos[this.contador].valorVeiculo
    }
    console.log(setEntrada);
    // /api/entradas-estoque-zero-km
    this.http.post(environment.urlRenave + 'renave/estoque/entrar-veiculozerokm', setEntrada, httpOptions).pipe().subscribe(res => {
      console.log(res);
      this.motos[this.contador].status = true;
      this.contador++;
      if (this.contador < this.total) {
        this.onSubmit(entrada, motos);
      } else {
        this.isCarregando = false;
        this.contador = 0;
        this.cancelar();
      }
    }, (err) => {
      console.log(err);
      this.motos[this.contador].status = false;
      this.contador++;
      // alert('Ocorreu algum problema com a moto ' + this.contador + '! Verifique os campos preenchidos e tente novamente.');
      if (this.contador < this.total) {
        this.onSubmit(entrada, motos);
      } else {
        this.isCarregando = false;
        this.contador = 0;
      }
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
        /* 
          Verificar se nota é de entrada
          Nota de entrada deve ter mesmo CNPJ destinatário do usuário
        */
        const usuario: Usuario = this.auth.getUsuario();
        const CPNJ_XML = xmlDoc.documentElement.getElementsByTagName("dest")[0].getElementsByTagName("CNPJ");
        const CNPJ_DEST = CPNJ_XML.length ? xmlDoc.documentElement.getElementsByTagName("dest")[0].getElementsByTagName("CNPJ")[0].textContent : '';
        if (CNPJ_DEST === usuario?.cnpj!) {
          // Dados da NF-e
          this.entrada.chaveNotaFiscal = xmlDoc.documentElement.getElementsByTagName("chNFe")[0].textContent;
          this.entrada.dataEntradaEstoque = xmlDoc.documentElement.getElementsByTagName("dhEmi")[0].textContent!.substring(0, 19);
          this.entrada.valorCompra = parseInt(xmlDoc.documentElement.getElementsByTagName("vUnTrib")[0].textContent!);
          // Dados do veículos
          this.motos = [];
          const veiculos = xmlDoc.documentElement.getElementsByTagName("det");
          this.total = veiculos.length;
          for (let index = 0; index < veiculos.length; index++) {
            const moto = veiculos[index];
            let motoInsert = { motoInline: '', chassi: '', valorVeiculo: 0, status: null };
            motoInsert.motoInline = moto.getElementsByTagName("infAdProd")[0].textContent!;
            const prod = moto.getElementsByTagName("prod")[0];
            motoInsert.chassi = prod.getElementsByTagName("chassi")[0].textContent!;
            motoInsert.valorVeiculo = parseInt(prod.getElementsByTagName("vUnTrib")[0].textContent!);
            this.motos.push(motoInsert);
          }
          this.entrada.quilometragemHodometro = 0;
          this.entrada.dataHoraMedicaoHodometro = this.entrada.dataEntradaEstoque;
        } else {
          this.snackbar.open('Seu CNPJ não pertence ao CNPJ destinatário', 'Fechar', {
            duration: 3000
          });
        }
      }
    }
    reader.readAsText(file, 'text/xml');
  }

}

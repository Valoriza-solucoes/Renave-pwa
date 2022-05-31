import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SaidasEstoqueVeiculoZeroKm } from '../../interfaces/saidas-estoque-veiculo-zero-km';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { Municipio } from 'src/app/interfaces/municipio';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { EstoqueService } from 'src/app/services/estoque.service';
import { municipios } from 'src/assets/municipios';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transferencia-estoque-zero-km',
  templateUrl: './transferencia-estoque-zero-km.component.html',
  styleUrls: ['./transferencia-estoque-zero-km.component.scss']
})
export class TransferenciaEstoqueZeroKmComponent implements OnInit {
  isCarregando = false;
  saidasEstoqueVeiculoZeroKm: SaidasEstoqueVeiculoZeroKm = {
    chaveNotaFiscal: '',
    comprador: {
      email: '',
      endereco: {
        bairro: '',
        cep: '',
        codigoMunicipio: 0,
        complemento: '',
        logradouro: '',
        numero: ''
      },
      nome: '',
      numeroDocumento: '',
      tipoDocumento: ''
    },
    cpfOperadorResponsavel: environment.cpfOperadorResponsavel,
    dataVenda: '',
    emailEstabelecimento: '',
    idEstoque: null,
    valorVenda: null
  };

  cidadeUf = '';
  municipioCtrl = new FormControl();
  filteredMunicipio: Observable<Municipio[]> | undefined;
  municipios: Municipio[] = municipios;
  fileName = '';
  motos: any = [];
  contador = 0;
  total = 0;

  constructor(private http: HttpClient, private auth: AuthService, private estoque: EstoqueService, private snackbar: MatSnackBar) {
    this.filteredMunicipio = this.municipioCtrl.valueChanges.pipe(
      startWith(''),
      map(municipio => (municipio ? this._filterMunicipios(municipio) : this.municipios.slice())),
    );
  }
  private _filterMunicipios(value: string): Municipio[] {
    const filterValue = value.toLowerCase();
    return this.municipios.filter(municipio => municipio.nome.toLowerCase().includes(filterValue));
  }
  filtraMunicipio(value: string, uf: string): Municipio[] {
    return this.municipios.filter(municipio => municipio.nome == value && municipio.uf == uf);
  }

  ngOnInit(): void {
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    if (typeof (FileReader) !== 'undefined') {

      const file = inputNode.files[0];

      var MIMEType = file.type;
      this.fileName = file.name;

      var reader = new FileReader();

      reader.onload = (e) => {
        var text = reader.result;
        if (typeof (text) === 'string') {
          const xmlDoc = new DOMParser().parseFromString(text, 'text/xml');
          console.log(xmlDoc.documentElement);

          /* 
            Verificar se nota é de entrada
            Nota de entrada deve ter mesmo CNPJ emitente do usuário
          */
          const usuario: Usuario = this.auth.getUsuario();
          const CPNJ_XML = xmlDoc.documentElement.getElementsByTagName("emit")[0].getElementsByTagName("CNPJ");
          const CNPJ_EMIT = CPNJ_XML.length ? xmlDoc.documentElement.getElementsByTagName("emit")[0].getElementsByTagName("CNPJ")[0].textContent : '';
          console.log(CNPJ_EMIT);
          if (CNPJ_EMIT === usuario?.cnpj!) {
            // Dados do comprador
            const compradorDoc = xmlDoc.documentElement.getElementsByTagName('dest')[0];
            this.saidasEstoqueVeiculoZeroKm.comprador.nome = compradorDoc.getElementsByTagName('xNome')[0].textContent!;
            this.saidasEstoqueVeiculoZeroKm.comprador.email = compradorDoc.getElementsByTagName('email').length ? compradorDoc.getElementsByTagName('email')[0].textContent! : '';
            if (compradorDoc.getElementsByTagName('CNPJ').length > 0) {
              this.saidasEstoqueVeiculoZeroKm.comprador.numeroDocumento = compradorDoc.getElementsByTagName('CNPJ')[0].textContent!;
              this.saidasEstoqueVeiculoZeroKm.comprador.tipoDocumento = 'CNPJ';
            } else if (compradorDoc.getElementsByTagName('CPF').length > 0) {
              this.saidasEstoqueVeiculoZeroKm.comprador.tipoDocumento = 'CPF';
              this.saidasEstoqueVeiculoZeroKm.comprador.numeroDocumento = compradorDoc.getElementsByTagName('CPF')[0].textContent!;
            }
            const endereco = compradorDoc.getElementsByTagName('enderDest')[0];
            this.saidasEstoqueVeiculoZeroKm.comprador.endereco.logradouro = endereco.getElementsByTagName('xLgr')[0].textContent!;
            this.saidasEstoqueVeiculoZeroKm.comprador.endereco.numero = endereco.getElementsByTagName('nro')[0].textContent!;
            this.saidasEstoqueVeiculoZeroKm.comprador.endereco.bairro = endereco.getElementsByTagName('xBairro')[0].textContent!;
            const municipio = endereco.getElementsByTagName('xMun')[0].textContent!;
            const uf = endereco.getElementsByTagName('UF')[0].textContent!;
            console.log(municipio, uf);
            const idMunicipio = this.filtraMunicipio(municipio, uf);
            this.saidasEstoqueVeiculoZeroKm.comprador.endereco.codigoMunicipio = parseInt(idMunicipio[0].id);
            this.cidadeUf = municipio + '-' + uf;
            this.saidasEstoqueVeiculoZeroKm.comprador.endereco.cep = endereco.getElementsByTagName('CEP')[0].textContent!;

            // Dados da NF-e
            this.saidasEstoqueVeiculoZeroKm.chaveNotaFiscal = xmlDoc.getElementsByTagName('chNFe')[0].textContent!;
            this.saidasEstoqueVeiculoZeroKm.dataVenda = xmlDoc.getElementsByTagName('dhRecbto')[0].textContent!.substring(0, 19);
            this.saidasEstoqueVeiculoZeroKm.valorVenda = parseInt(xmlDoc.getElementsByTagName('vNF')[0].textContent!);
            this.saidasEstoqueVeiculoZeroKm.emailEstabelecimento = xmlDoc.getElementsByTagName('infRespTec').length ? xmlDoc.getElementsByTagName('infRespTec')[0].getElementsByTagName('email')[0].textContent! : '';
            console.log('saidasEstoqueVeiculoZeroKm 2', this.saidasEstoqueVeiculoZeroKm);

            //MOTOS
            this.motos = [];
            const veiculos = xmlDoc.documentElement.getElementsByTagName("det");
            this.total = veiculos.length;
            for (let index = 0; index < veiculos.length; index++) {
              const moto = veiculos[index];
              let motoInsert = { motoInline: '', idEstoque: 0, status: null };
              const motoInline = xmlDoc.documentElement.getElementsByTagName("infAdProd")[0].textContent!;
              motoInsert.motoInline = motoInline;
              // CHASSI
              this.saidasEstoqueVeiculoZeroKm.idEstoque = null;
              // Verifica se o produto no XML contém Veículo
              const veicProd = moto.getElementsByTagName('prod')[0].getElementsByTagName('veicProd');
              let cProd = moto.getElementsByTagName('prod')[0].getElementsByTagName('cProd')[0].textContent!;
              this.saidasEstoqueVeiculoZeroKm.idEstoque = parseInt(cProd);
              motoInsert.idEstoque = parseInt(cProd);
              this.motos.push(motoInsert);
              this.isCarregando = false;
            }
          } else {
            this.snackbar.open('Seu CNPJ não pertence ao CNPJ emitente', 'Fechar', {
              duration: 3000
            });
          }
        }
      }
      reader.readAsText(file, MIMEType);
    }
  }

  salvar(): void {
    this.isCarregando = true;

    const usuario: Usuario = this.auth.getUsuario();
    const httpOptions = {
      headers: new HttpHeaders({
        'cnpj': usuario?.cnpj!,
        'pwd': usuario?.pwd!,
      })
    };
    this.saidasEstoqueVeiculoZeroKm.idEstoque = this.motos[this.contador].idEstoque!;
    console.log(this.saidasEstoqueVeiculoZeroKm);
    this.http.post(environment.urlRenave + 'renave/estoque/sair-veiculozerokm', this.saidasEstoqueVeiculoZeroKm, httpOptions).pipe().subscribe(
      (res => {
        console.log('passou', res);
        this.motos[this.contador].status = true;
        this.contador++;
        if (this.contador < this.total) {
          this.salvar();
        } else {
          this.isCarregando = false;
          this.contador = 0;
          this.cancelar();
        }
      }),
      (err => {
        console.log(err);
        this.motos[this.contador].status = false;
        this.contador++;
        let msg = '';
        if (err.error) {
          if (err.error.mensagemParaUsuarioFinal) {
            msg = err.error.mensagemParaUsuarioFinal;
          } else {
            msg = err.error.detalhe;
          }
        } else if (err.message) {
          msg = err.message;
        } else {
          msg = 'Ocorreu um erro desconhecido';
        }
        this.snackbar.open(msg, 'Fechar', {
          duration: 3000
        });
        if (this.contador < this.total) {
          this.salvar();
        } else {
          this.isCarregando = false;
        }
      })
    );
  }

  cancelar() {
    this.motos = [];
    this.saidasEstoqueVeiculoZeroKm = {
      chaveNotaFiscal: '',
      comprador: {
        email: '',
        endereco: {
          bairro: '',
          cep: '',
          codigoMunicipio: 0,
          complemento: '',
          logradouro: '',
          numero: ''
        },
        nome: '',
        numeroDocumento: '',
        tipoDocumento: ''
      },
      cpfOperadorResponsavel: environment.cpfOperadorResponsavel,
      dataVenda: '',
      emailEstabelecimento: '',
      idEstoque: null,
      valorVenda: null
    };
    let file: any = document.getElementById('file');
    file.value = '';
  }

}

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
@Component({
  selector: 'app-saidas-estoque-veiculo-zero-km',
  templateUrl: './saidas-estoque-veiculo-zero-km.component.html',
  styleUrls: ['./saidas-estoque-veiculo-zero-km.component.scss']
})
export class SaidasEstoqueVeiculoZeroKmComponent implements OnInit {
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

  motoInline = '';
  cidadeUf = '';
  municipioCtrl = new FormControl();
  filteredMunicipio: Observable<Municipio[]> | undefined;
  municipios: Municipio[] = municipios;
  fileName = '';

  constructor(private http: HttpClient, private auth: AuthService, private estoque: EstoqueService) {
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

          const motoInline = xmlDoc.documentElement.getElementsByTagName("infAdProd")[0].textContent;
          this.motoInline = motoInline!;
          console.log(xmlDoc.documentElement);

          const dados = xmlDoc.documentElement.firstChild!.firstChild!;

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

          // CHASSI
          this.saidasEstoqueVeiculoZeroKm.idEstoque = null;
          // Verifica se o produto no XML contém Veículo
          const veicProd = xmlDoc.documentElement.getElementsByTagName('prod')[0].getElementsByTagName('veicProd');
          let chassi;
          this.isCarregando = true;
          if (veicProd.length == 0) {
            chassi = xmlDoc.documentElement.getElementsByTagName('prod')[0].getElementsByTagName('cProd')[0].textContent!;
          } else { // Se tiver veicProd
            chassi = veicProd[0].getElementsByTagName('chassi')[0].textContent!;
          }
          this.estoque.resEstoqueChassi(chassi).subscribe((res) => {
            console.log(res);
            if (Array.isArray(res) && res.length > 0) {
              this.saidasEstoqueVeiculoZeroKm.idEstoque = res[0].id!;
            }
            this.isCarregando = false;
          }, (err) => { this.isCarregando = false; console.log(err.error.detalhe); });
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
    console.log(this.saidasEstoqueVeiculoZeroKm);
    this.http.post(environment.urlRenave + 'renave/estoque/sair-veiculozerokm', this.saidasEstoqueVeiculoZeroKm, httpOptions).pipe().subscribe(
      (res => { console.log('passou', res); this.isCarregando = false; }),
      (err => {
        console.log(err);
        if (err.error) {
          alert(err.error.mensagemParaUsuarioFinal);
        } else if (err.message) {
          alert(err.message);
        }
        this.isCarregando = false;
      })
    );
  }

  cancelar() {
    this.motoInline = '';
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

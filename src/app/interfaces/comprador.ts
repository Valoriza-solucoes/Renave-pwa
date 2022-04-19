import { Endereco } from "./endereco";

export interface Comprador {
    email: string,
    endereco: Endereco,
    nome: string,
    numeroDocumento: string,
    tipoDocumento: 'CPF' | 'CNPJ' | ''
}
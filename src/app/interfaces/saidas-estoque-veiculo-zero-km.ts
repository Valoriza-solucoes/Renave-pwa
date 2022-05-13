import { Comprador } from "./comprador";

export interface SaidasEstoqueVeiculoZeroKm {
    chaveNotaFiscal: string,
    comprador: Comprador,
    cpfOperadorResponsavel: string,
    dataVenda: string,
    emailEstabelecimento: string,
    idEstoque: number | null,
    valorVenda: number | null
}

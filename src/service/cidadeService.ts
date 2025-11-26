import URL_ENDPOINTS from "../constants/URL_ENDPOINTS";
import type { CidadeDTO, CidadeUsuarioDTO } from "../types/cidade/cidadeType";
import { httpRequest } from "./api";

async function criarCidade(cidade : CidadeDTO) : Promise<CidadeDTO> {
  const url = URL_ENDPOINTS.CIDADE.CRIAR_CIDADE;
  const response = await httpRequest<CidadeDTO>({
    url,
    method: 'POST',
    body: cidade
  });
  return response;
}

async function criarCidadeUsuario(usuarioId: number, cidade: CidadeUsuarioDTO): Promise<CidadeDTO> {
  const url = URL_ENDPOINTS.CIDADE.CRIAR_CIDADE_USUARIO.replace(':usuarioId', usuarioId.toString());
  const response = await httpRequest<CidadeDTO>({
    url,
    method: 'POST',
    body: cidade
  });
  return response; 
}

async function listarTodos(): Promise<CidadeDTO[]> {
  const url = URL_ENDPOINTS.CIDADE.LISTAR_TODOS;
  const response = await httpRequest<CidadeDTO[]>({
    url,
    method: 'GET'
  });
  return response;
}

async function listarPorTipo(tipo: 'OFICIAL' | 'USUARIO' = 'OFICIAL', usuarioId?: number): Promise<CidadeDTO[]> {
  const url = `${URL_ENDPOINTS.CIDADE.LISTAR_TODOS}?tipo=${tipo}${usuarioId ? `&usuarioId=${usuarioId}` : ''}`;
  const response = await httpRequest<CidadeDTO[]>({
    url,
    method: 'GET'
  });
  return response;
}

async function buscarPorId(id:number): Promise<CidadeDTO> {
  const url = URL_ENDPOINTS.CIDADE.BUSCAR_POR_ID + id;
  const response = await httpRequest<CidadeDTO>({
    url,
    method: 'GET'
  });
  return response;
}

async function buscarPorUf(uf:string): Promise<CidadeDTO[]> {
  const url = URL_ENDPOINTS.CIDADE.BUSCAR_POR_UF + uf;
  const response = await httpRequest<CidadeDTO[]>({
    url,
    method: 'GET'
  });
  return response;
}

async function buscarPorNomeEUf(nomeCidade:string, uf:string) : Promise<CidadeDTO[]> {
  const url = URL_ENDPOINTS.CIDADE.BUSCAR_POR_NOME_E_UF;
  const response = await httpRequest<CidadeDTO[]>({
    url,
    method: 'GET',
    params: { nomeCidade, uf }
  });
  return response;
  
}

async function buscarPorNome(nome:string): Promise<CidadeDTO[]> {
  const url = URL_ENDPOINTS.CIDADE.BUSCAR_POR_NOME;
  const response = await httpRequest<CidadeDTO[]>({
    url,
    method: 'GET',
    params: { nome }
  });
  return response;
}

async function buscarPorUfENome(uf:string, nome:string): Promise<CidadeDTO[]> {
  const url = URL_ENDPOINTS.CIDADE.BUSCAR_POR_UF_E_NOME;
  const response = await httpRequest<CidadeDTO[]>({
    url,
    method: 'GET',
    params: { uf, nome }
  });
  return response;
}

async function atualizarCidade(idCidade : number, cidade : CidadeDTO) : Promise<CidadeDTO> {
  const url = URL_ENDPOINTS.CIDADE.ATUALIZAR_CIDADE + idCidade;
  const response = await httpRequest<CidadeDTO>({
    url,
    method: 'PUT',
    body: cidade
  });
  return response;
}

async function deletarCidade(idCidade : number) : Promise<void> {
  const url = URL_ENDPOINTS.CIDADE.DELETAR_CIDADE + idCidade;
  await httpRequest<void>({
    url,
    method: 'DELETE'
  });
}

async function existePorNNomeEUf(nome:string, uf:string): Promise<boolean> {
  const url = URL_ENDPOINTS.CIDADE.EXISTE_POR_NOME_E_UF;
  const response = await httpRequest<{ exists: boolean }>({
    url,
    method: 'GET',
    params: { nome, uf }
  });
  return response.exists;
}

export const cidadeService = {
  criarCidade,
  criarCidadeUsuario,
  listarTodos,
  listarPorTipo,
  buscarPorId,
  buscarPorUf,
  buscarPorNomeEUf,
  buscarPorNome,
  buscarPorUfENome,
  atualizarCidade,
  deletarCidade,
  existePorNNomeEUf
};
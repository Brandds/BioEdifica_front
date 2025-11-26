import URL_ENDPOINTS from "../constants/URL_ENDPOINTS";
import type { EstadoDTO } from "../types/estado/estadoType";
import { httpRequest } from "./api";

export const estadoSerivce = {
  criarEstado,
  listaTodos,
  buscarPorId,
  buscarPorUf,
  buscarPorNome,
  atualizarEstado,
  deletarEstado
}


async function criarEstado() :Promise<EstadoDTO>{
  const url = URL_ENDPOINTS.ESTADO.CRIAR_ESTADO;
  const response = await httpRequest<EstadoDTO>({
    url: url,
    method: 'POST',
  });
  return response;
}

async function listaTodos() :Promise<EstadoDTO[]>{
  const url = URL_ENDPOINTS.ESTADO.LISTAR_TODOS;
  const response = await httpRequest<EstadoDTO[]>({
    url: url,
    method: 'GET',
  });
  return response;
}

async function buscarPorId(idEstado:number) :Promise<EstadoDTO> {
  const url = URL_ENDPOINTS.ESTADO.BUSCAR_POR_ID + idEstado;
  const response = await httpRequest<EstadoDTO>({
    url: url,
    method: 'GET',
  });
  return response;
} 

async function buscarPorUf(uf:string) :Promise<EstadoDTO> {
  const url = URL_ENDPOINTS.ESTADO.BUSCAR_POR_UF + uf;
  const response = await httpRequest<EstadoDTO>({
    url: url,
    method: 'GET',
  });
  return response;
}

async function buscarPorNome(nome:string) :Promise<EstadoDTO[]> {
  const url = URL_ENDPOINTS.ESTADO.BUSCAR_POR_NOME;
  const response = await httpRequest<EstadoDTO[]>({
    url: url,
    method: 'GET',
    params: { nome }
  });
  return response;
}

async function atualizarEstado(idEstado:number, estado:EstadoDTO) :Promise<EstadoDTO>{
  const url = URL_ENDPOINTS.ESTADO.ATUALIZAR_ESTADO + idEstado;
  const response = await httpRequest<EstadoDTO>({
    url: url,
    method: 'PUT',
    body: estado
  });
  return response;
}

async function deletarEstado(idEstado:number) :Promise<void>{
  const url = URL_ENDPOINTS.ESTADO.DELETAR_ESTADO + idEstado;
  await httpRequest<void>({
    url: url,
    method: 'DELETE',
  });
}
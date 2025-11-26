import URL_ENDPOINTS from "../constants/URL_ENDPOINTS";
import type { ZoneamentoBioclimaticoDTO } from "../types/zoneamentoBioclimatico/zoneamentoBioclimaticoType";
import { httpRequest } from "./api";

export const zoneamentoBioclimaticoService = {
  criarZoneamento,
  listarTodos,
  buscarPorId,
  buscarPorUf,
  buscarPorCidade,
  buscarPorZonaBioclimatica,
  buscarPorNomeCidade,
  buscarPorCidadeId,
  atualizarZoneamento,
  deletarZoneamento,
};


async function criarZoneamento(zoneamento : ZoneamentoBioclimaticoDTO) : Promise<ZoneamentoBioclimaticoDTO>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.CRIAR_ZONEAMENTO;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO>({
    url,
    method: 'POST',
    body: zoneamento
  });
  return response;
}


async function listarTodos() : Promise<ZoneamentoBioclimaticoDTO[]>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.LISTAR_TODOS;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO[]>({
    url,
    method: 'GET',
  });
  return response;
}

async function buscarPorId(id: number) : Promise<ZoneamentoBioclimaticoDTO>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.BUSCAR_POR_ID + id;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO>({
    url,
    method: 'GET',
  });
  return response;
}


async function buscarPorUf(uf: string) : Promise<ZoneamentoBioclimaticoDTO[]>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.BUSCAR_POR_UF + uf;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO[]>({
    url,
    method: 'GET',
  });
  return response;
}

async function buscarPorCidade(cidade: string, uf : string) : Promise<ZoneamentoBioclimaticoDTO[]>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.BUSCAR_POR_CIDADE;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO[]>({
    url,
    method: 'POST',
    params:{
      cidade,
      uf
    }
  });
  return response;
}

async function buscarPorZonaBioclimatica(zona: string) : Promise<ZoneamentoBioclimaticoDTO[]>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.BUSCAR_POR_ZONA_BIOCLIMATICA + zona;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO[]>({
    url,
    method: 'GET',
  });
  return response;
}

async function buscarPorNomeCidade(nomeCidade: string) : Promise<ZoneamentoBioclimaticoDTO[]>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.BUSCAR_POR_NOME_CIDADE;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO[]>({
    url,
    method: 'GET',
    params:{
      nomeCidade
    }
  });
  return response;
}

async function buscarPorCidadeId(cidadeId: number) : Promise<ZoneamentoBioclimaticoDTO>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.BUSCAR_POR_CIDADE_ID + cidadeId;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO>({
    url,
    method: 'GET',
  });
  return response;
}

async function atualizarZoneamento(id : number, zoneamento : ZoneamentoBioclimaticoDTO) : Promise<ZoneamentoBioclimaticoDTO>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.ATUALIZAR_ZONEAMENTO + id;
  const response = await httpRequest<ZoneamentoBioclimaticoDTO>({
    url,
    method: 'PUT',
    body: zoneamento
  });
  return response;
}

async function deletarZoneamento(id : number) : Promise<void>{
  const url = URL_ENDPOINTS.ZONEAMENTO_BIOCLIMATICO.DELETAR_ZONEAMENTO + id;
  await httpRequest<void>({
    url,
    method: 'DELETE',
  });
}

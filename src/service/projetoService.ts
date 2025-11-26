import URL_ENDPOINTS from "../constants/URL_ENDPOINTS";
import type { ProjetoDetalhadoDTO, ProjetoDTO } from "../types/projeto/projetoType";
import { httpRequest } from "./api";


export const projetoService = {
  getProjetosByUsuario,
  getProjetoById,
  criarProjeto,
  atualizarProjeto,
  deleteProjeto
};

async function getProjetosByUsuario(idUsuario : number): Promise<ProjetoDTO[]> {
  const url = URL_ENDPOINTS.PROJETO.GET_PROJETOS_BY_USUARIO + idUsuario;
  const response = await httpRequest<ProjetoDTO[]>({
    url,
    method: 'GET',
  });
  return response;
}

async function getProjetoById(idProjeto : number): Promise<ProjetoDetalhadoDTO> {
  const url = URL_ENDPOINTS.PROJETO.GET_PROJETO_BY_ID + idProjeto;
  const response = await httpRequest<ProjetoDetalhadoDTO>({
    url,
    method: 'GET',
  });
  return response;
}

async function criarProjeto(projeto: ProjetoDTO): Promise<ProjetoDetalhadoDTO> {
  const url = URL_ENDPOINTS.PROJETO.CRIAR_PROJETO;
  const response = await httpRequest<ProjetoDetalhadoDTO>({
    url,
    method: 'POST',
    body: projeto,
  });
  return response;
}

async function atualizarProjeto(projeto: ProjetoDTO, idProjeto: number | undefined): Promise<ProjetoDetalhadoDTO> {
  const url = URL_ENDPOINTS.PROJETO.ATUALIZAR_PROJETO + idProjeto;
  const response = await httpRequest<ProjetoDetalhadoDTO>({
    url,
    method: 'PUT',
    body: projeto,
  });
  return response;
}

async function deleteProjeto(idProjeto: number, idUsuario: number): Promise<void> {
  const url = URL_ENDPOINTS.PROJETO.DELETAR_PROJETO + `${idProjeto}/${idUsuario}`;
  await httpRequest<void>({
    url,
    method: 'PUT',
  });
}


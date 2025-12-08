import URL_ENDPOINTS from "../constants/URL_ENDPOINTS";
import type { CamadaResponseDTO, CriarCamadaComCalculoDTO } from "../types/camada/camadaType";
import { httpRequest } from "./api";

export const camadaService = {
  criarCamadaComCalculo,
  listarCamadasPorProjeto,
  buscarCamadaPorId,
  excluirCamada
}

async function criarCamadaComCalculo(camada: CriarCamadaComCalculoDTO): Promise<CamadaResponseDTO> {
  const url = URL_ENDPOINTS.CAMADA.CRIAR_CAMADA_COM_CALCULO;
  const response = await httpRequest<CamadaResponseDTO>({
    url,
    method: 'POST',
    body: camada,
  });
  return response;
}

async function listarCamadasPorProjeto(projetoId: number): Promise<CamadaResponseDTO[]> {
  const url = URL_ENDPOINTS.CAMADA.LISTAR_CAMADAS_POR_PROJETO + projetoId;
  const response = await httpRequest<CamadaResponseDTO[]>({
    url,
    method: 'GET',
  });
  return response;
}

async function buscarCamadaPorId(camadaId: number): Promise<CamadaResponseDTO> {
  const url = URL_ENDPOINTS.CAMADA.BUSCAR_CAMADA_POR_ID + camadaId;
  const response = await httpRequest<CamadaResponseDTO>({
    url,
    method: 'GET',
  });
  return response;
}

async function excluirCamada(camadaId: number): Promise<void> {
  const url = URL_ENDPOINTS.CAMADA.EXCLUIR_CAMADA + camadaId;
  await httpRequest<void>({
    url,
    method: 'DELETE',
  });
}

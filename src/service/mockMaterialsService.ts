import URL_ENDPOINTS from "../constants/URL_ENDPOINTS";
import type { MaterialCategoriaDTO, MaterialDTO, MaterialVisualizacaoDTO } from "../types/material/materialType";
import { httpRequest } from "./api";

export const mockMaterialsService = {
  getMaterialCategorias,
  getMaterialsByCategory,
  getMaterialsByTipoProduto,
  getMaterialsByTipoFamilia,
  getMaterialById,
}


async function getMaterialCategorias(): Promise<MaterialCategoriaDTO[]> {
  const url = URL_ENDPOINTS.MOCK_MATERIAIS.GET_CATEGORIAS;
  const response = await httpRequest<MaterialCategoriaDTO[]>({
    url,
    method: 'GET',
  });
  return response;
}

async function getMaterialsByCategory(category: string): Promise<MaterialVisualizacaoDTO[]> {
  const url = URL_ENDPOINTS.MOCK_MATERIAIS.GET_MATERIALS_BY_CATEGORY + category;
  const response = await httpRequest<MaterialVisualizacaoDTO[]>({
    url: url,
    method: 'GET',
  });
  return response;
}

async function getMaterialsByTipoProduto(tipoProduto: string): Promise<MaterialVisualizacaoDTO[]> {
  const url = URL_ENDPOINTS.MOCK_MATERIAIS.GET_MATERIALS_BY_TIPO_PRODUTO + tipoProduto;
  const response = await httpRequest<MaterialVisualizacaoDTO[]>({
    url: url,
    method: 'GET',
  });
  return response;
}

async function getMaterialsByTipoFamilia(tipoFamilia: string): Promise<MaterialVisualizacaoDTO[]> {
  const url = URL_ENDPOINTS.MOCK_MATERIAIS.GET_MATERIALS_BY_TIPO_FAMILIA + tipoFamilia;
  const response = await httpRequest<MaterialVisualizacaoDTO[]>({
    url: url,
    method: 'GET',
  });
  return response;
}

async function getMaterialById(id: number): Promise<MaterialDTO> {
  const url = URL_ENDPOINTS.MOCK_MATERIAIS.GET_MATERIAL_BY_ID + id;
  const response = await httpRequest<MaterialDTO>({
    url: url,
    method: 'GET',
  });
  return response;
}

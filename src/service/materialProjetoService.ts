import URL_ENDPOINTS from "../constants/URL_ENDPOINTS";
import type { MaterialVisualizacaoDTO } from "../types/material/materialType";
import type {
  AdicionarMaterialDoCatalogoDTO,
  MaterialProjetoDTO
} from "../types/materialProjeto/materialProjetoType";
import { httpRequest } from "./api";

export const materialProjetoService = {
  buscarMateriaisComPropriedadesTermicas,
  adicionarMaterialDoCatalogo,
  adicionarMaterialCustomizado,
  atualizarPropriedadesTermicas,
  removerMaterialDoProjeto
};

async function buscarMateriaisComPropriedadesTermicas(projetoId: number) : Promise<MaterialVisualizacaoDTO[]> {
  const url = URL_ENDPOINTS.MATERIAL_PROJETO.BUSCAR_MATERIAIS_COM_PROPRIEDADES_TERMICAS + projetoId;
  const response = await httpRequest<MaterialVisualizacaoDTO[]>({
    url: url,
    method: 'GET',
  });
  return response;
}

async function adicionarMaterialDoCatalogo(projetoId: number, request: AdicionarMaterialDoCatalogoDTO) : Promise<MaterialProjetoDTO[]> {
  const url = URL_ENDPOINTS.MATERIAL_PROJETO.ADICIONAR_MATERIAL_DO_CATALOGO + projetoId;
  const response = await httpRequest<MaterialProjetoDTO[]>({
    url: url,
    method: 'POST',
    body: request
  });
  return response;
}

async function adicionarMaterialCustomizado(projetoId: number, material: MaterialProjetoDTO) : Promise<MaterialProjetoDTO> {
  const url = URL_ENDPOINTS.MATERIAL_PROJETO.ADICIONAR_MATERIAL_CUSTOMIZADO + projetoId;
  const response = await httpRequest<MaterialProjetoDTO>({
    url: url,
    method: 'POST',
    body: material
  });
  return response;
}

async function atualizarPropriedadesTermicas(materialId: number, material: MaterialProjetoDTO) : Promise<MaterialProjetoDTO> {
  const url = URL_ENDPOINTS.MATERIAL_PROJETO.ATUALIZAR_PROPRIEDADES_TERMICAS + materialId;
  const response = await httpRequest<MaterialProjetoDTO>({
    url: url,
    method: 'PUT',
    body: material
  });
  return response;
}

async function removerMaterialDoProjeto(materialId: number) : Promise<void> {
  const url = URL_ENDPOINTS.MATERIAL_PROJETO.REMOVER_MATERIAL_DO_PROJETO + materialId;
  await httpRequest<void>({
    url: url,
    method: 'DELETE',
  });
}

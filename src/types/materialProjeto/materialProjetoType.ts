
interface MaterialProjetoDTO{
  id: number;
  idMaterialExterno: number;
  nomeMaterial: string;
  tipoAplicacao: string;
  densidade: number;
  calorEspecifico: number;
  condutividadeTermica: number;
  espessura: number;
}

interface MaterialCalculoDTO {
  idMaterialMock: number;
  espessura: number;
  ordem: number;
}

interface AdicionarMaterialDoCatalogoDTO {
  nomeCamada?: string; // Nome da camada (opcional - se não fornecido, usa "Camada {tipoCamada}")
  tipoCamada: string; // PAREDE, COBERTURA, PISO
  materiais: MaterialCalculoDTO[];
}

// Deprecated - usar AdicionarMaterialDoCatalogoDTO
interface AdicionarMaterialProjetoDTO{
  idMaterialExterno: number;
  espessura: number;
}

export type {
    AdicionarMaterialDoCatalogoDTO, AdicionarMaterialProjetoDTO, MaterialCalculoDTO, MaterialProjetoDTO
};


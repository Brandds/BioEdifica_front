// DTOs para cálculo térmico

export interface MaterialCalculoDTO {
  idMaterialMock: number;
  espessura: number;
  ordem: number;
}

export interface CalculoTermicoRequestDTO {
  tipoCamada: string; // "PAREDE" | "COBERTURA" | "PISO"
  materiais: MaterialCalculoDTO[];
}

export interface MaterialDetalhadoDTO {
  idMaterialMock: number;
  nomeMaterial: string;
  espessura: number;
  ordem: number;
  densidade: number;
  calorEspecifico: number;
  condutividadeTermica: number;
}

export interface CalculoTermicoResponseDTO {
  transmitanciaTermica: number; // U [W/(m².K)]
  capacidadeTermica: number; // CT [kJ/(m².K)]
  atrasoTermico: number; // φ [horas]
  resistenciaTermicaTotal: number; // RT [m².K/W]
  materiaisDetalhados: MaterialDetalhadoDTO[];
}

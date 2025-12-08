export interface MaterialCamadaDTO {
  materialId: number;
  espessura: number;
  ordem: number;
}

export interface CriarCamadaComCalculoDTO {
  nome: string;
  tipoCamada: 'PAREDE' | 'PISO' | 'COBERTURA';
  projetoId: number;
  materiais: MaterialCamadaDTO[];
}

export interface MaterialCamadaResponseDTO {
  materialProjetoId: number;
  materialId: number;
  materialName: string;
  espessura: number;
  ordem: number;
  condutividadeTermica: number;
  densidade: number;
  calorEspecifico: number;
}

export interface CalculoTermicoEmbedded {
  transmitanciaTermica: number;
  capacidadeTermica: number;
  atrasoTermico: number;
  fatorSolarAdmissivel: number;
  resistenciaTermicaTotal: number;
  absortanciaRadiacaoSolar: number;
}

export interface CamadaResponseDTO {
  id: number;
  nome: string;
  tipoCamada: 'PAREDE' | 'PISO' | 'COBERTURA';
  materiais: MaterialCamadaResponseDTO[];
  calculoTermico: CalculoTermicoEmbedded | null;
}

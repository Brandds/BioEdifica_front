export interface CarbonoMaterialDTO {
  idMaterialMock: number;
  nomeMaterial: string;
  tipoMaterial: string;
  espessura: number;
  densidade: number;
  massaPorUnidade: number;
  co2PorKg: number;
  carbonoA1A3: number;
  carbonoC1C4: number;
  carbonoBiogenico: number | null;
  carbonoTotalMaterial: number;
}

export interface CarbonoIncorporadoResponseDTO {
  carbonoTotalPorArea: number;
  carbonoTotalAbsoluto: number;
  areaTotalProjeto: number;
  nomeProjeto: string;
  quantidadeMateriais: number;
  materiaisDetalhados: CarbonoMaterialDTO[];
}

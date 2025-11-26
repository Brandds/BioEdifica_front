export interface MaterialCategoriaDTO{
  tipoMaterial: string;
  urlImagem: string;
  quantidade : number;
  tipoFamiliaMaterial: string;
  tipoProduto: string;
}

export interface MaterialVisualizacaoDTO {
  id: number;
  materialName: string;
  materialType: string;
  dataSourceUrl: string;
  density: number;
  materialTypeFamily: string;
  idMaterialExterno?: number;
}

export interface MaterialDTO {
  id: number;
  source_uuid: string;
  material_name: string;
  group_elements_nrm_1: Array<string>;
  elements_nrm_1: Array<string>;
  product_type: string;
  productTypeFamily: Array<string>;
  uniclass_systems: Array<string>;
  uniclass_products: Array<string>;
  uniclass_materials: Array<string>;
  material_type: string;
  material_type_family: string;
  data_source: string;
  data_source_url: string;
  data_source_year: number;
  data_source_country: string;
  functional_unit_quantity: string;
  functional_unit_unit: string;
  total_co2e_kg_mf: number;
  carbon_a1a3: number;
  density: number;
  density_estimated: boolean;
  mass_per_piece: number;
  mass_per_piece_estimated: boolean;
  mass_per_declared_unit: number;
  mass_per_declared_unit_estimated: boolean;
  created: string;
  updated: string;
  generic_api_url: string;
  calor_especifico?: number;
  condutividade_termica?: number;
}
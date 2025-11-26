import type { CidadeDetalhadaDTO } from "../cidade/cidadeType";
import type { MaterialDTO } from "../material/materialType";

interface ProjetoDTO {
  id?: number;
  nome: string;
  descricao: string;
  usuarioId: number;
  cidadeId?: number;
  areaTotalConstruida?: number;
}

interface ProjetoDetalhadoDTO extends ProjetoDTO {
  materiais: Array<MaterialDTO>;
  cidade?: CidadeDetalhadaDTO;
}

export type { ProjetoDetalhadoDTO, ProjetoDTO };

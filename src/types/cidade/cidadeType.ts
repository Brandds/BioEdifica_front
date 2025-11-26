import type { EstadoDTO } from "../estado/estadoType";
import type { ZoneamentoBioclimaticoDTO, ZoneamentoDTO } from "../zoneamentoBioclimatico/zoneamentoBioclimaticoType";

interface CidadeDTO {
  id: number;
  nome: string;
  estado: EstadoDTO
  tipo: 'OFICIAL' | 'USUARIO';
}

interface CidadeDetalhadaDTO extends CidadeDTO {
  zoneamentoBioclimatico: ZoneamentoBioclimaticoDTO;
}

interface CidadeUsuarioDTO{
  nome: string;
  estadoId: number;
  zoneamentoBioclimatico: ZoneamentoDTO
}


export type { CidadeDetalhadaDTO, CidadeDTO, CidadeUsuarioDTO };


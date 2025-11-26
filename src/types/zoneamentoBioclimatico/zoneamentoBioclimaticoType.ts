import type { CidadeDTO } from "../cidade/cidadeType";


interface ZoneamentoDTO {
  zonaBioclimatica: string;
  latitude: number;
  longitude: number;
  altitude: number;
  temperaturaBulboSeco?: number;
  umidadeRelativa?: number;
  radiacaoHorizontalGlobal?: number;
  velocidadeVento?: number;
  amplitudeTermica?: number;
}

interface ZoneamentoBioclimaticoDTO extends ZoneamentoDTO {
  id : number;
  cidade : CidadeDTO;
}


export type { ZoneamentoBioclimaticoDTO, ZoneamentoDTO };

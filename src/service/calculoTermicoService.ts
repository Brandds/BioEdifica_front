import URL_ENDPOINTS from '../constants/URL_ENDPOINTS';
import type { CalculoTermicoRequestDTO, CalculoTermicoResponseDTO } from '../types/calculoTermico/calculoTermicoType';
import type { CarbonoIncorporadoResponseDTO } from '../types/carbonoIncorporado/carbonoIncorporadoType';
import { httpRequest } from './api';


export const calculoTermicoService ={
  calcularPropriedadesTermicas,
  calcularCarbonoIncorporado
}



async function calcularPropriedadesTermicas(materiais : CalculoTermicoRequestDTO) : Promise<CalculoTermicoResponseDTO>{
  const url = URL_ENDPOINTS.CALCULO_TERMICO.CALCULAR_PROPRIEDADES_TERMICAS;
  const response = await httpRequest<CalculoTermicoResponseDTO>({
    url,
    method: 'POST',
    body: materiais
  });
  return response;
}

async function calcularCarbonoIncorporado(projetoId: number) : Promise<CarbonoIncorporadoResponseDTO>{
  const url = URL_ENDPOINTS.CALCULO_TERMICO.CALCULAR_CARBONO_IMCORPORADO + projetoId;
  const response = await httpRequest<CarbonoIncorporadoResponseDTO>({
    url,
    method: 'GET'
  });
  return response;
}

import * as yup from 'yup';

export const validationCriaProjeto = yup.object({
  nome: yup
    .string()
    .required('Nome do projeto é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  descricao: yup
    .string()
    .required('Descrição do projeto é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim(),
  usuarioId: yup
    .number()
    .nullable()
    .default(null),
  areaTotalConstruida: yup
    .number()
    .nullable()
    .positive('A área total construída deve ser um valor positivo')
    .default(5000),
});


export const validationCriarCidadeUsuario = yup.object({
  nome: yup.string()
    .required("Nome da cidade é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  estadoId: yup.number()
    .required("Estado é obrigatório")
    .positive("Estado deve ser selecionado"),
  zoneamentoBioclimatico: yup.object({
    zonaBioclimatica: yup.string()
      .required("Zona bioclimática é obrigatória"),
    latitude: yup.number()
      .required("Latitude é obrigatória")
      .min(-90, "Latitude deve estar entre -90 e 90")
      .max(90, "Latitude deve estar entre -90 e 90"),
    longitude: yup.number()
      .required("Longitude é obrigatória")
      .min(-180, "Longitude deve estar entre -180 e 180")
      .max(180, "Longitude deve estar entre -180 e 180"),
    altitude: yup.number()
      .required("Altitude é obrigatória")
      .min(0, "Altitude deve ser positiva"),
  })
});
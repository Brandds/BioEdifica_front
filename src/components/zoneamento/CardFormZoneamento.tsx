import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zoneamentoCardSx } from "../../componentsSx/zoneamentoSx/ZoneamentoMapsSx,";
import { cidadeService } from '../../service/cidadeService';
import { estadoSerivce } from "../../service/estadoService";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { hideLoading, showLoading } from "../../store/slices/loadingSlice";
import type { CidadeUsuarioDTO } from "../../types/cidade/cidadeType";
import type { EstadoDTO } from "../../types/estado/estadoType";
import { validationCriarCidadeUsuario } from "../../validationYup/constantsYup";

const schema = validationCriarCidadeUsuario;

type ZoneamentoFormProps = {
  exibirMensagem: (mensagem: string, severidade: 'success' | 'error') => void;
  onCidadeCriada?: () => void;
};

export default function CardFormZoneamento({ exibirMensagem, onCidadeCriada }: ZoneamentoFormProps) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CidadeUsuarioDTO>({
    resolver: yupResolver(schema),
    defaultValues: {
      nome: "",
      estadoId: 0,
      zoneamentoBioclimatico: {
        zonaBioclimatica: "",
        latitude: 0,
        longitude: 0,
        altitude: 0,
      }
    }
  });

  const { data: estados = [], isLoading: isLoadingEstados } = useQuery({
    queryKey: ["estados"],
    queryFn: estadoSerivce.listaTodos,
  });

  const createCidadeMutation = useMutation({
    mutationFn: async (data: CidadeUsuarioDTO) => {
      dispatch(showLoading('Criando cidade...'));

      const delayPromise = new Promise(resolve => setTimeout(resolve, 8000));
      const apiPromise = cidadeService.criarCidadeUsuario(user?.userId!, data);

      const [, response] = await Promise.all([delayPromise, apiPromise]);
      return response;
    },
    onSuccess: (data) => {
      dispatch(hideLoading());

      console.log('Cidade criada com sucesso:', data);
      exibirMensagem('Cidade criada com sucesso!', 'success');
      reset();

      if (onCidadeCriada) {
        onCidadeCriada();
      }
    },
    onError: (error) => {
      dispatch(hideLoading());
      console.error('Erro ao criar cidade:', error);
      exibirMensagem('Erro ao criar cidade. Tente novamente.', 'error');
    }
  });

  const onSubmit = (data: CidadeUsuarioDTO) => {
    createCidadeMutation.mutate(data);
  };

  return (
    <Container sx={zoneamentoCardSx}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Criar Nova Cidade
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, textAlign: 'center' }}>
        <Grid container spacing={3}>
          {/* Seção de Informações Básicas */}
          <Box sx={{ width: '100%' }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
                Informações da Cidade
              </Typography>
            </Grid>

            {/* Nome da Cidade e Estado - lado a lado */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="nome"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nome da Cidade"
                      error={!!errors.nome}
                      helperText={errors.nome?.message}
                      variant="outlined"
                      placeholder="Digite o nome da cidade"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="estadoId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.estadoId}>
                      <InputLabel>Estado</InputLabel>
                      <Select {...field} label="Estado" disabled={isLoadingEstados}>
                        {estados.map((estado: EstadoDTO) => (
                          <MenuItem key={estado.id} value={estado.id}>
                            {estado.nome} - {estado.uf}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.estadoId && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.estadoId.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Box>
          </Box>

          {/* Seção de Zoneamento Bioclimático */}
          <Box sx={{ width: '100%' }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main', fontWeight: 600 }}>
                Dados de Zoneamento Bioclimático
              </Typography>
            </Grid>

            {/* Zona Bioclimática e Altitude - lado a lado */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="zoneamentoBioclimatico.zonaBioclimatica"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Zona Bioclimática"
                      error={!!errors.zoneamentoBioclimatico?.zonaBioclimatica}
                      helperText={errors.zoneamentoBioclimatico?.zonaBioclimatica?.message}
                      placeholder="ex: 3B"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="zoneamentoBioclimatico.altitude"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Altitude (m)"
                      error={!!errors.zoneamentoBioclimatico?.altitude}
                      helperText={errors.zoneamentoBioclimatico?.altitude?.message}
                      inputProps={{ step: 0.1 }}
                      placeholder="ex: 850.5"
                    />
                  )}
                />
              </Grid>
            </Box>

          </Box>

          {/* Coordenadas Geográficas */}
          <Box sx={{ width: '100%' }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: 500 }}>
                Coordenadas Geográficas
              </Typography>
            </Grid>

            {/* Latitude e Longitude - lado a lado */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="zoneamentoBioclimatico.latitude"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Latitude"
                      error={!!errors.zoneamentoBioclimatico?.latitude}
                      helperText={errors.zoneamentoBioclimatico?.latitude?.message}
                      inputProps={{ step: 0.0001 }}
                      placeholder="ex: -19.9191"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="zoneamentoBioclimatico.longitude"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Longitude"
                      error={!!errors.zoneamentoBioclimatico?.longitude}
                      helperText={errors.zoneamentoBioclimatico?.longitude?.message}
                      inputProps={{ step: 0.0001 }}
                      placeholder="ex: -44.2619"
                    />
                  )}
                />
              </Grid>
            </Box>
          </Box>
          {/* Botão de Submit */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={createCidadeMutation.isPending}
              sx={{ mt: 2, py: 1.5 }}
            >
              {createCidadeMutation.isPending ? "Adicionando..." : "Adicionar Cidade"}
            </Button>
          </Grid>
        </Grid>
      </Box >
    </Container >
  );
} 

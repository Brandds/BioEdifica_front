import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Card, CardContent, Chip, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Snackbar, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { cidadeService } from '../../service/cidadeService';
import { projetoService } from '../../service/projetoService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { hideLoading, showLoading } from '../../store/slices/loadingSlice';
import type { CidadeDTO } from '../../types/cidade/cidadeType';
import type { ProjetoDetalhadoDTO, ProjetoDTO } from '../../types/projeto/projetoType';
import { validationCriaProjeto } from '../../validationYup/constantsYup';

type Projeto = {
  nome: string;
  descricao: string;
  usuarioId: number | null;
  areaTotalConstruida?: number;
};

type CriarProjetoProps = {
  projeto?: ProjetoDetalhadoDTO;
  onSubmit?: (projeto: Projeto) => void;
};


type FormData = yup.InferType<typeof validationCriaProjeto>;

export default function CriarProjeto({ projeto, onSubmit }: CriarProjetoProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');
  const [isEditing, setIsEditing] = useState(!projeto); // Se não tem projeto, está criando (editando)

  // Estados para seleção de cidade
  const [cidades, setCidades] = useState<CidadeDTO[]>([]);
  const [cidadesFiltradas, setCidadesFiltradas] = useState<CidadeDTO[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<CidadeDTO | null>(null);
  const [filtroUF, setFiltroUF] = useState<string>('');
  const [filtroBusca, setFiltroBusca] = useState<string>('');
  const [loadingCidades, setLoadingCidades] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const validationSchema = validationCriaProjeto;

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nome: projeto?.nome || '',
      descricao: projeto?.descricao || '',
      usuarioId: user?.userId || null,
      areaTotalConstruida: projeto?.areaTotalConstruida || 5000,
    }
  });

  useEffect(() => {
    if (projeto) {
      reset({
        nome: projeto.nome || '',
        descricao: projeto.descricao || '',
        usuarioId: user?.userId || null,
        areaTotalConstruida: projeto.areaTotalConstruida || 5000,
      });

      // Se o projeto já tem cidade, definir como selecionada
      if (projeto.cidade) {
        const cidadeDTO: CidadeDTO = {
          id: projeto.cidade.id,
          nome: projeto.cidade.nome,
          estado: projeto.cidade.estado,
          tipo: projeto.cidade.tipo,
        };
        setCidadeSelecionada(cidadeDTO);
      }
    }
  }, [projeto, user?.userId, reset]);

  // Carregar todas as cidades ao montar o componente
  useEffect(() => {
    const carregarCidades = async () => {
      setLoadingCidades(true);
      try {
        const response = await cidadeService.listarPorTipo('OFICIAL', user?.userId);
        setCidades(response);
        setCidadesFiltradas(response);
      } catch (error) {
        console.error('Erro ao carregar cidades:', error);
        handleOpenSnackbar('Erro ao carregar cidades', 'error');
      } finally {
        setLoadingCidades(false);
      }
    };

    carregarCidades();
  }, []);

  // Filtrar cidades quando os filtros mudarem
  useEffect(() => {
    let resultado = [...cidades];

    // Filtro por UF
    if (filtroUF) {
      resultado = resultado.filter(cidade => cidade.estado?.uf === filtroUF);
    }

    // Filtro por busca (nome da cidade)
    if (filtroBusca) {
      resultado = resultado.filter(cidade =>
        cidade.nome?.toLowerCase().includes(filtroBusca.toLowerCase())
      );
    }

    setCidadesFiltradas(resultado);
  }, [filtroUF, filtroBusca, cidades]);

  // Obter lista única de UFs para o filtro
  const ufsDisponiveis = Array.from(
    new Set(cidades.map(c => c.estado?.uf).filter(Boolean))
  ).sort();

  const criarProjetoMutation = useMutation({
    mutationFn: async (dadosProjeto: Projeto) => {
      dispatch(showLoading('Criando projeto...'));

      const projeto: ProjetoDTO = {
        nome: dadosProjeto.nome,
        descricao: dadosProjeto.descricao,
        usuarioId: dadosProjeto.usuarioId!,
        cidadeId: cidadeSelecionada?.id,
        areaTotalConstruida: dadosProjeto.areaTotalConstruida || 5000,
      };

      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));

      const apiPromise = onSave(projeto);

      const [, response] = await Promise.all([delayPromise, apiPromise]);

      return response;
    },
    onSuccess: (data, variables) => {
      dispatch(hideLoading());

      console.log('Projeto criado:', data);

      if (onSubmit) {
        onSubmit(variables);
      } else {
        handleOpenSnackbar('Projeto criado com sucesso!', 'success');
        setTimeout(() => navigate('/projetos'), 1500);
      }
    },
    onError: (error) => {
      dispatch(hideLoading());

      console.error('Erro ao criar projeto:', error);
      handleOpenSnackbar('Erro ao criar projeto. Tente novamente.', 'error');
    }
  });


  // Mutation para atualizar projeto
  const atualizarProjetoMutation = useMutation({
    mutationFn: async (dadosProjeto: Projeto) => {
      dispatch(showLoading('Atualizando projeto...'));

      const projetoAtualizado: ProjetoDTO = {
        id: projeto!.id!,
        nome: dadosProjeto.nome,
        descricao: dadosProjeto.descricao,
        usuarioId: user?.userId!,
        cidadeId: cidadeSelecionada?.id,
        areaTotalConstruida: dadosProjeto.areaTotalConstruida || 5000,
      };

      const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));
      const apiPromise = projetoService.atualizarProjeto(projetoAtualizado, user?.userId!);

      const [, response] = await Promise.all([delayPromise, apiPromise]);
      return response;
    },
    onSuccess: (data) => {
      dispatch(hideLoading());
      console.log('Projeto atualizado:', data);
      setIsEditing(false); // Sair do modo de edição
      handleOpenSnackbar('Projeto atualizado com sucesso!', 'success');
    },
    onError: (error) => {
      dispatch(hideLoading());
      console.error('Erro ao atualizar projeto:', error);
      handleOpenSnackbar('Erro ao atualizar projeto. Tente novamente.', 'error');
    }
  });

  const onSubmitForm = (data: FormData) => {
    const dadosCompletos: Projeto = {
      ...data,
      usuarioId: user?.userId || null
    };

    if (projeto && isEditing) {
      // Atualizar projeto existente
      atualizarProjetoMutation.mutate(dadosCompletos);
    } else {
      // Criar novo projeto
      criarProjetoMutation.mutate(dadosCompletos);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form para valores originais
    if (projeto) {
      reset({
        nome: projeto.nome || '',
        descricao: projeto.descricao || '',
        usuarioId: user?.userId || null,
        areaTotalConstruida: projeto.areaTotalConstruida || 5000,
      });

      // Restaurar cidade selecionada original
      if (projeto.cidade) {
        const cidadeDTO: CidadeDTO = {
          id: projeto.cidade.id,
          nome: projeto.cidade.nome,
          estado: projeto.cidade.estado,
          tipo: projeto.cidade.tipo,
        };
        setCidadeSelecionada(cidadeDTO);
      } else {
        setCidadeSelecionada(null);
      }
    }
  };

  const handleOpenSnackbar = (message: string, severity: 'error' | 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSave = async (newProjeto: ProjetoDTO) => {
    const response = await projetoService.criarProjeto(newProjeto);
    return response;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h5" color="success.main" fontWeight={700} gutterBottom>
        {projeto ? 'Editar projeto' : 'Criar novo projeto'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Controller
          name="nome"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nome do projeto"
              fullWidth
              error={!!errors.nome}
              helperText={errors.nome?.message}
              sx={{ mb: 2 }}
              disabled={projeto && !isEditing}
            />
          )}
        />

        <Controller
          name="descricao"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Descrição"
              fullWidth
              multiline
              rows={3}
              error={!!errors.descricao}
              helperText={errors.descricao?.message}
              sx={{ mb: 2 }}
              disabled={projeto && !isEditing}
            />
          )}
        />

        <Controller
          name="areaTotalConstruida"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Área Total Construída (m²)"
              fullWidth
              type="number"
              inputProps={{ step: "0.01", min: "0" }}
              error={!!errors.areaTotalConstruida}
              helperText={errors.areaTotalConstruida?.message || "Valor padrão: 5.000 m²"}
              sx={{ mb: 2 }}
              disabled={projeto && !isEditing}
            />
          )}
        />

        {/* Seção de seleção de cidade */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>
          Localização do projeto (opcional)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecione a cidade onde o projeto será executado para cálculos regionalizados
        </Typography>

        {/* Filtros de cidade */}
        {(isEditing || !projeto) && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filtrar por UF</InputLabel>
                  <Select
                    value={filtroUF}
                    onChange={(e) => setFiltroUF(e.target.value)}
                    label="Filtrar por UF"
                  >
                    <MenuItem value="">Todas as UFs</MenuItem>
                    {ufsDisponiveis.map((uf) => (
                      <MenuItem key={uf} value={uf}>
                        {uf}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  size="small"
                  label="Buscar cidade"
                  value={filtroBusca}
                  onChange={(e) => setFiltroBusca(e.target.value)}
                  placeholder="Digite o nome da cidade"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Exibição da cidade selecionada no modo visualização */}
        {projeto && !isEditing && cidadeSelecionada && (
          <Card
            sx={{
              mb: 2,
              border: '2px solid',
              borderColor: 'success.main',
              backgroundColor: 'success.light',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {cidadeSelecionada.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cidadeSelecionada.estado?.nome} - {cidadeSelecionada.estado?.uf}
                  </Typography>
                </Box>
                <Chip
                  label={cidadeSelecionada.estado?.uf}
                  color="primary"
                  size="small"
                />
              </Box>
              {projeto.cidade?.zoneamentoBioclimatico && (
                <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                  Zona Bioclimática: <strong>{projeto.cidade.zoneamentoBioclimatico.zonaBioclimatica}</strong>
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Grid de cidades para seleção (modo criação/edição) */}
        {(isEditing || !projeto) && (
          <Box sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }}>
            {loadingCidades ? (
              <Typography variant="body2" color="text.secondary" align="center">
                Carregando cidades...
              </Typography>
            ) : cidadesFiltradas.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                Nenhuma cidade encontrada
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {cidadesFiltradas.map((cidade) => (
                  <Grid item xs={12} sm={6} md={4} key={cidade.id}>
                    <Card
                      onClick={() => setCidadeSelecionada(cidade)}
                      sx={{
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: cidadeSelecionada?.id === cidade.id ? 'success.main' : 'transparent',
                        backgroundColor: cidadeSelecionada?.id === cidade.id ? 'success.light' : 'background.paper',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {cidade.nome}
                          </Typography>
                          <Chip
                            label={cidade.estado?.uf}
                            color="primary"
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {cidade.estado?.nome}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Botão para visualizar informações da cidade selecionada */}
        {cidadeSelecionada && (
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/cidade/${cidadeSelecionada.id}`)}
            >
              Visualizar informações da cidade
            </Button>
          </Box>
        )}

        {/* Botões dinâmicos baseados no estado */}
        {projeto && !isEditing ? (
          // Modo visualização: apenas botão Editar
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleEdit}
            sx={{ mt: 2 }}
          >
            Editar projeto
          </Button>
        ) : (
          // Modo criação/edição: botões de ação
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              disabled={criarProjetoMutation.isPending || atualizarProjetoMutation.isPending}
            >
              {(criarProjetoMutation.isPending || atualizarProjetoMutation.isPending)
                ? (projeto ? 'Atualizando...' : 'Criando...')
                : (projeto ? 'Atualizar projeto' : 'Criar projeto')
              }
            </Button>

            {projeto && (
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleCancelEdit}
                disabled={criarProjetoMutation.isPending || atualizarProjetoMutation.isPending}
              >
                Cancelar
              </Button>
            )}
          </Box>
        )}
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
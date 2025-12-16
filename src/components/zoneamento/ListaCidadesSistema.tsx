import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cidadeService } from '../../service/cidadeService';
import { useAppSelector } from '../../store/hooks';
import type { CidadeDTO } from '../../types/cidade/cidadeType';

type ListaCidadesSistemaProps = {
  onRecarregar?: () => void;
};

export default function ListaCidadesSistema({ onRecarregar }: ListaCidadesSistemaProps = {}) {
  const navigate = useNavigate();
  const [cidades, setCidades] = useState<CidadeDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtroUF, setFiltroUF] = useState<string>('');
  const [filtroBusca, setFiltroBusca] = useState<string>('');
  const [cidadeSelecionada, setCidadeSelecionada] = useState<number | null>(null);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  // Lista de UFs brasileiras
  const ufsDisponiveis = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Buscar cidades quando os filtros mudarem (com debounce para o campo de busca)
  useEffect(() => {
    // Só busca se tiver pelo menos UF selecionado ou 3 caracteres no nome
    if (filtroUF || filtroBusca.length >= 3) {
      const timer = setTimeout(() => {
        buscarCidades();
      }, 500); // Debounce de 500ms

      return () => clearTimeout(timer);
    } else if (filtroBusca.length === 0 && !filtroUF) {
      // Limpa resultados se não tiver filtros
      setCidades([]);
      setBuscaRealizada(false);
    }
  }, [filtroUF, filtroBusca]);

  const buscarCidades = async () => {
    try {
      setLoading(true);
      let dados: CidadeDTO[] = [];

      if (filtroUF && filtroBusca) {
        // Buscar por UF e nome
        dados = await cidadeService.buscarPorUfENome(filtroUF, filtroBusca);
      } else if (filtroUF) {
        // Buscar apenas por UF
        dados = await cidadeService.buscarPorUf(filtroUF);
      } else if (filtroBusca) {
        // Buscar apenas por nome
        dados = await cidadeService.buscarPorNome(filtroBusca);
      }

      setCidades(dados);
      setBuscaRealizada(true);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      setCidades([]);
    } finally {
      setLoading(false);
    }
  };

  const visualizarCidade = (cidadeId: number) => {
    navigate(`/cidade/${cidadeId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Filtros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Estado (UF)</InputLabel>
            <Select
              value={filtroUF}
              label="Estado (UF)"
              onChange={(e) => setFiltroUF(e.target.value)}
            >
              <MenuItem value="">
                <em>Todos os estados</em>
              </MenuItem>
              {ufsDisponiveis.map((uf) => (
                <MenuItem key={uf} value={uf}>
                  {uf}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            label="Buscar cidade"
            value={filtroBusca}
            onChange={(e) => setFiltroBusca(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="success" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Informações */}
      {buscaRealizada && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {cidades.length} {cidades.length === 1 ? 'cidade encontrada' : 'cidades encontradas'}
          </Typography>
          {cidadeSelecionada && (
            <Button
              variant="contained"
              color="success"
              startIcon={<InfoIcon />}
              onClick={() => visualizarCidade(cidadeSelecionada)}
            >
              Visualizar Informações
            </Button>
          )}
        </Box>
      )}

      {/* Mensagem inicial */}
      {!buscaRealizada && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Pesquise por cidades
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Selecione um estado ou digite o nome de uma cidade (mínimo 3 caracteres)
          </Typography>
        </Box>
      )}

      {/* Lista de Cidades */}
      {buscaRealizada && !loading && (
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          <Grid container spacing={2}>
            {cidades.map((cidade) => (
              <Grid item xs={12} sm={6} md={4} key={cidade.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: cidadeSelecionada === cidade.id ? '2px solid #388e3c' : '1px solid #e0e0e0',
                    bgcolor: cidadeSelecionada === cidade.id ? '#e8f5e9' : '#fff',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => setCidadeSelecionada(cidade.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                        {cidade.nome}
                      </Typography>
                      <IconButton
                        size="small"
                        color="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          visualizarCidade(cidade.id);
                        }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Chip
                      label={cidade.estado.uf}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      {cidade.estado.nome}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {buscaRealizada && !loading && cidades.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma cidade encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tente ajustar os filtros de busca
          </Typography>
        </Box>
      )}
    </Box>
  );
}

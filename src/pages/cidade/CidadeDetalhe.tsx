import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResponsiveAppBar from '../../components/header/ResponsiveAppBar';
import { cidadeService } from '../../service/cidadeService';
import { zoneamentoBioclimaticoService } from '../../service/zoneamentoBioclimaticoService';
import { useAppDispatch } from '../../store/hooks';
import { hideLoading, showLoading } from '../../store/slices/loadingSlice';
import { appBarSxMaterialCategoria } from '../../styles/sx/AppBar';
import type { CidadeDTO } from '../../types/cidade/cidadeType';
import type { ZoneamentoBioclimaticoDTO } from '../../types/zoneamentoBioclimatico/zoneamentoBioclimaticoType';

// Mapeamento das zonas bioclimáticas para suas descrições
const getDescricaoZonaBioclimatica = (zona: string): string => {
  const mapeamento: Record<string, string> = {
    '1R': 'Muito fria com inverno rigoroso',
    '1M': 'Muito fria com inverno moderado',
    '2R': 'Fria com inverno rigoroso',
    '2M': 'Fria com inverno moderado',
    '3A': 'Mista e úmida',
    '3B': 'Mista e seca',
    '4A': 'Levemente quente e úmida',
    '4B': 'Levemente quente e seca',
    '5A': 'Quente e úmida',
    '5B': 'Quente e seca',
    '6A': 'Muito quente e úmida',
    '6B': 'Muito quente e seca',
  };
  return mapeamento[zona] || 'Descrição não disponível';
};

// Função para obter cor baseada na zona bioclimática
const getCorZonaBioclimatica = (zona: string): string => {
  const primeiroCaractere = zona.charAt(0);
  const cores: Record<string, string> = {
    '1': '#1976d2', // Azul - Muito fria
    '2': '#0288d1', // Azul claro - Fria
    '3': '#66bb6a', // Verde - Mista
    '4': '#ffa726', // Laranja - Levemente quente
    '5': '#ef5350', // Vermelho - Quente
    '6': '#d32f2f', // Vermelho escuro - Muito quente
  };
  return cores[primeiroCaractere] || '#2e7d32';
};

export default function CidadeDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [cidade, setCidade] = useState<CidadeDTO | null>(null);
  const [zoneamento, setZoneamento] = useState<ZoneamentoBioclimaticoDTO | null>(null);
  const [cidadeNaoEncontrada, setCidadeNaoEncontrada] = useState(false);

  useEffect(() => {
    if (id) {
      carregarDados(parseInt(id));
    }
  }, [id]);

  const carregarDados = async (cidadeId: number) => {
    dispatch(showLoading('Carregando dados da cidade...'));
    setCidadeNaoEncontrada(false);

    try {
      const cidadeData = await cidadeService.buscarPorId(cidadeId);
      setCidade(cidadeData);

      try {
        const zoneamentoData = await zoneamentoBioclimaticoService.buscarPorCidadeId(cidadeId);
        setZoneamento(zoneamentoData);
      } catch (error) {
        console.log('Cidade sem dados de zoneamento bioclimático');
      }
    } catch (error) {
      console.error('Erro ao carregar dados da cidade:', error);
      setCidadeNaoEncontrada(true);
    } finally {
      dispatch(hideLoading());
    }
  };

  if (cidadeNaoEncontrada) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" color="error">Cidade não encontrada.</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Voltar</Button>
      </Box>
    );
  }

  if (!cidade) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f5f7fa',
      }}
    >
      <ResponsiveAppBar sx={appBarSxMaterialCategoria} />

      {/* Header */}
      <Box sx={{ background: 'linear-gradient(90deg, #2e7d32 60%, #66bb6a 100%)', color: '#fff', py: 3, px: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: '#fff', mb: 2 }}
        >
          Voltar
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocationCityIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>{cidade.nome}</Typography>
            <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
              {cidade.estado.nome} ({cidade.estado.uf})
            </Typography>
          </Box>
        </Box>
      </Box>

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        sx={{ p: 4 }}
        alignItems="flex-start"
      >
        {/* Coluna Esquerda - Informações da Cidade */}
        <Box flex={1} minWidth={0}>
          {/* Informações Básicas */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon /> Informações da Cidade
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Nome</Typography>
                <Typography variant="h6" fontWeight={600}>{cidade.nome}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Estado</Typography>
                <Typography variant="body1" fontWeight={600}>{cidade.estado.nome}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">UF</Typography>
                <Chip label={cidade.estado.uf} color="success" size="small" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Tipo</Typography>
                <Chip
                  label={cidade.tipo === 'OFICIAL' ? 'Cidade Oficial' : 'Cidade do Usuário'}
                  color={cidade.tipo === 'OFICIAL' ? 'success' : 'primary'}
                  size="small"
                />
              </Grid>
              {/* {cidade. && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Criado por</Typography>
                  <Typography variant="body1" fontWeight={600}>{cidade.usuarioCriador.nome}</Typography>
                </Grid>
              )} */}
            </Grid>
          </Paper>

          {/* Localização no Mapa */}
          {zoneamento && zoneamento.latitude && zoneamento.longitude && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PublicIcon /> Localização
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ width: '100%', height: 300, borderRadius: 2, overflow: 'hidden' }}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps?q=${zoneamento.latitude},${zoneamento.longitude}&z=12&output=embed`}
                  title="Localização da cidade"
                />
              </Box>
            </Paper>
          )}
        </Box>

        {/* Coluna Direita - Dados de Zoneamento Bioclimático */}
        <Box flex={1} minWidth={0}>
          {zoneamento ? (
            <>
              {/* Zona Bioclimática */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mb: 3,
                  background: `linear-gradient(135deg, ${getCorZonaBioclimatica(zoneamento.zonaBioclimatica)}15 0%, ${getCorZonaBioclimatica(zoneamento.zonaBioclimatica)}30 100%)`,
                  border: `2px solid ${getCorZonaBioclimatica(zoneamento.zonaBioclimatica)}`,
                }}
              >
                <Typography variant="h6" sx={{ color: getCorZonaBioclimatica(zoneamento.zonaBioclimatica), display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ThermostatIcon /> Zona Bioclimática
                </Typography>
                <Divider sx={{ mb: 2, borderColor: getCorZonaBioclimatica(zoneamento.zonaBioclimatica) }} />

                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography
                    variant="h2"
                    fontWeight={700}
                    sx={{ color: getCorZonaBioclimatica(zoneamento.zonaBioclimatica), mb: 2 }}
                  >
                    {zoneamento.zonaBioclimatica}
                  </Typography>
                  <Chip
                    label={getDescricaoZonaBioclimatica(zoneamento.zonaBioclimatica)}
                    sx={{
                      bgcolor: getCorZonaBioclimatica(zoneamento.zonaBioclimatica),
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      py: 2.5,
                      px: 1,
                      height: 'auto',
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        textAlign: 'center',
                      },
                    }}
                  />
                </Box>
              </Paper>

              {/* Dados Climáticos */}
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Dados Climáticos
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">Temperatura (Bulbo Seco)</Typography>
                        <Typography variant="h6" fontWeight={600}>{zoneamento.temperaturaBulboSeco}°C</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">Umidade Relativa</Typography>
                        <Typography variant="h6" fontWeight={600}>{zoneamento.umidadeRelativa}%</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">Velocidade do Vento</Typography>
                        <Typography variant="h6" fontWeight={600}>{zoneamento.velocidadeVento} m/s</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">Amplitude Térmica</Typography>
                        <Typography variant="h6" fontWeight={600}>{zoneamento.amplitudeTermica}°C</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>

              {/* Dados Geográficos */}
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Dados Geográficos
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Latitude</Typography>
                    <Typography variant="body1" fontWeight={600}>{zoneamento.latitude}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Longitude</Typography>
                    <Typography variant="body1" fontWeight={600}>{zoneamento.longitude}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">Altitude</Typography>
                    <Typography variant="body1" fontWeight={600}>{zoneamento.altitude}m</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Radiação Horizontal Global</Typography>
                    <Typography variant="body1" fontWeight={600}>{zoneamento.radiacaoHorizontalGlobal} W/m²</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </>
          ) : (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <ThermostatIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Dados de Zoneamento Indisponíveis
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Esta cidade não possui informações de zoneamento bioclimático cadastradas.
              </Typography>
            </Paper>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import ScienceIcon from '@mui/icons-material/Science';
import { Box, Button, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResponsiveAppBar from '../../components/header/ResponsiveAppBar';
import { MaterialDetalheBoxHeaderButtonSx, MaterialDetalheBoxHeaderSubtitleSx, MaterialDetalheBoxHeaderSx, MaterialDetalheContainerSx, MaterialDetalheStackSxBoxPaperBoxImagemSx, MaterialDetalheStackSxBoxPaperBoxSx, MaterialDetalheStackSxBoxPaperClassificaoBoxSx, MaterialDetalheStackSxBoxPaperClassificaoTitleSx, MaterialDetalheStackSxBoxPaperSx } from '../../componentsSx/material/MaterialDetalhe';
import { mockMaterialsService } from '../../service/mockMaterialsService';
import { useAppDispatch } from '../../store/hooks';
import { hideLoading, showLoading } from '../../store/slices/loadingSlice';
import { appBarSxMaterialCategoria } from '../../styles/sx/AppBar';
import type { MaterialDTO } from '../../types/material/materialType';

export default function MaterialDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [material, setMaterial] = useState<MaterialDTO | null>(null);
  const [materialNaoEncontrado, setMaterialNaoEncontrado] = useState(false);

  useEffect(() => {
    if (id && !isNaN(parseInt(id))) {
      getMaterialById(parseInt(id));
    }
  }, [id]);

  const getMaterialById = async (materialId: number) => {
    dispatch(showLoading('Carregando dados do material...'));
    setMaterialNaoEncontrado(false);

    try {
      const response = await mockMaterialsService.getMaterialById(materialId);
      console.log('Material encontrado:', response);
      setMaterial(response);
    } catch (error) {
      console.error('Erro ao buscar material:', error);
      setMaterialNaoEncontrado(true);
    } finally {
      dispatch(hideLoading());
    }
  }

  if (materialNaoEncontrado) {
    return (
      <Box sx={{ p: 4 }}>
        <ResponsiveAppBar sx={appBarSxMaterialCategoria} />
        <Typography variant="h5" color="error">Material não encontrado.</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Voltar</Button>
      </Box>
    );
  }

  if (!material) {
    return null;
  }

  return (
    <Box
      sx={MaterialDetalheContainerSx}
    >
      <ResponsiveAppBar sx={appBarSxMaterialCategoria} />
      {/* Header */}
      <Box sx={MaterialDetalheBoxHeaderSx}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={MaterialDetalheBoxHeaderButtonSx}
        >
          Voltar
        </Button>
        <Typography variant="h4" fontWeight={700}>{material.material_name}</Typography>
        <Typography variant="subtitle1" sx={MaterialDetalheBoxHeaderSubtitleSx}>
          {material.material_type} • {material.material_type_family}
        </Typography>
      </Box>

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        sx={{ p: 4 }}
        alignItems="flex-start"
      >
        {/* Coluna Esquerda - Imagem e Informações Básicas */}
        <Box flex={1} minWidth={0}>
          {/* Imagem do Material */}
          <Paper elevation={3} sx={MaterialDetalheStackSxBoxPaperSx}>
            <Box sx={MaterialDetalheStackSxBoxPaperBoxSx}>
              <img
                src={material.data_source_url}
                alt={material.material_name}
                style={MaterialDetalheStackSxBoxPaperBoxImagemSx}
              />
            </Box>
            <Typography variant="h6" color="success.main" gutterBottom>
              {material.product_type}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fonte: {material.data_source} ({material.data_source_year})
            </Typography>
          </Paper>

          {/* Classificações Uniclass */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="success.main" gutterBottom sx={MaterialDetalheStackSxBoxPaperClassificaoTitleSx}>
              <ScienceIcon /> Classificações Técnicas
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Sistemas Uniclass
            </Typography>
            <Box sx={MaterialDetalheStackSxBoxPaperClassificaoBoxSx}>
              {material.uniclass_systems && material.uniclass_systems.length > 0 ? (
                material.uniclass_systems.map((system, i) => (
                  <Chip key={i} label={system} size="small" color="success" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhum sistema disponível</Typography>
              )}
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Produtos Uniclass
            </Typography>
            <Box sx={MaterialDetalheStackSxBoxPaperClassificaoBoxSx}>
              {material.uniclass_products && material.uniclass_products.length > 0 ? (
                material.uniclass_products.map((product, i) => (
                  <Chip key={i} label={product} size="small" color="primary" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhum produto disponível</Typography>
              )}
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Materiais Uniclass
            </Typography>
            <Box sx={MaterialDetalheStackSxBoxPaperClassificaoBoxSx}>
              {material.uniclass_materials && material.uniclass_materials.length > 0 ? (
                material.uniclass_materials.map((mat, i) => (
                  <Chip key={i} label={mat} size="small" color="secondary" variant="outlined" />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhum material disponível</Typography>
              )}
            </Box>
          </Paper>

          {/* Elementos e Grupos NRM */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Aplicações NRM
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Grupos de Elementos
            </Typography>
            <Box sx={{ mb: 2 }}>
              {material.group_elements_nrm_1 && material.group_elements_nrm_1.length > 0 ? (
                material.group_elements_nrm_1.map((group, i) => (
                  <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                    • {group}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhum grupo disponível</Typography>
              )}
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Elementos
            </Typography>
            <Box>
              {material.elements_nrm_1 && material.elements_nrm_1.length > 0 ? (
                material.elements_nrm_1.map((element, i) => (
                  <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                    • {element}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">Nenhum elemento disponível</Typography>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Coluna Direita - Dados Técnicos e Ambientais */}
        <Box flex={1} minWidth={0}>
          {/* Dados de Carbono */}
          <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: '#e8f5e9' }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Impacto de Carbono
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total CO₂e (A1-A3)
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="success.main">
                    {material.total_co2e_kg_mf.toFixed(3)} kg CO₂e/{material.functional_unit_unit}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Carbono A1-A3
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.dark">
                    {material.carbon_a1a3.toFixed(3)} kg CO₂e/{material.functional_unit_unit}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Propriedades Físicas */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              Propriedades Físicas
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Densidade</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {material.density} kg/m³
                  {material.density_estimated && (
                    <Typography component="span" variant="caption" color="warning.main" sx={{ ml: 1 }}>
                      (Estimado)
                    </Typography>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Unidade Funcional</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {material.functional_unit_quantity} {material.functional_unit_unit}
                </Typography>
              </Grid>
              {material.calor_especifico && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Calor Específico</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {material.calor_especifico} kJ/(kg.K)
                  </Typography>
                </Grid>
              )}
              {material.condutividade_termica && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Condutividade Térmica</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {material.condutividade_termica} W/(m.K)
                  </Typography>
                </Grid>
              )}
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Massa por Unidade</Typography>
                <Typography variant="body1" fontWeight={600}>
                  {material.mass_per_declared_unit} kg
                  {material.mass_per_declared_unit_estimated && (
                    <Typography component="span" variant="caption" color="warning.main" sx={{ ml: 1 }}>
                      (Estimado)
                    </Typography>
                  )}
                </Typography>
              </Grid>
              {material.mass_per_piece && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Massa por Peça</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {material.mass_per_piece.toFixed(3)} kg
                    {material.mass_per_piece_estimated && (
                      <Typography component="span" variant="caption" color="warning.main" sx={{ ml: 1 }}>
                        (Estimado)
                      </Typography>
                    )}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Origem e Certificação */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon /> Origem e Certificação
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">País de Origem</Typography>
              <Typography variant="body1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PublicIcon fontSize="small" color="success" />
                {material.data_source_country}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Fonte de Dados</Typography>
              <Typography variant="body1" fontWeight={600}>
                {material.data_source} ({material.data_source_year})
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">URL da API</Typography>
              <Typography
                variant="body2"
                sx={{
                  wordBreak: 'break-all',
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={() => window.open(material.generic_api_url, '_blank')}
              >
                {material.generic_api_url}
              </Typography>
            </Box>
          </Paper>

          {/* Informações de Registro */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon /> Informações de Registro
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">UUID da Fonte</Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {material.source_uuid}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Data de Criação</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(material.created).toLocaleDateString('pt-BR')}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Última Atualização</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(material.updated).toLocaleDateString('pt-BR')}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
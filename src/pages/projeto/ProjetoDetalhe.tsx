import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';
import Co2Icon from '@mui/icons-material/Co2';
import ConstructionIcon from '@mui/icons-material/Construction';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Alert, Badge, Box, Button, Card, CardContent, CardMedia, Drawer, IconButton, Paper, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CarbonoIncorporadoModal from '../../components/carbonoIncorporado/CarbonoIncorporadoModal';
import ResponsiveAppBar from '../../components/header/ResponsiveAppBar';
import CadastrarMaterialDrawer from '../../components/material/CadastrarMaterialDrawer';
import { MaterialCard } from '../../components/material/MaterialCard';
import CriarProjeto from '../../components/projeto/CriarProjeto';
import { calculoTermicoService } from '../../service/calculoTermicoService';
import { materialProjetoService } from '../../service/materialProjetoService';
import { projetoService } from '../../service/projetoService';
import { useAppDispatch } from '../../store/hooks';
import { hideLoading, showLoading } from '../../store/slices/loadingSlice';
import { appBarSxMaterialCategoria } from '../../styles/sx/AppBar';
import { projetoSx } from '../../styles/sx/projeto/ProjetoSx';
import type { CarbonoIncorporadoResponseDTO } from '../../types/carbonoIncorporado/carbonoIncorporadoType';
import type { MaterialVisualizacaoDTO } from '../../types/material/materialType';
import type { ProjetoDetalhadoDTO } from '../../types/projeto/projetoType';

// Simulação de dados de projetos e materiais



export default function ProjetoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [projeto, setProjeto] = useState<ProjetoDetalhadoDTO | null>(null);
  const [materiais, setMateriais] = useState<MaterialVisualizacaoDTO[]>([]);
  const [materiaisParaRemover, setMateriaisParaRemover] = useState<MaterialVisualizacaoDTO[]>([]);
  const [drawerRemocaoOpen, setDrawerRemocaoOpen] = useState(false);
  const [drawerCadastroOpen, setDrawerCadastroOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [projetoNaoEncontrado, setProjetoNaoEncontrado] = useState(false);
  const [carbonoModalOpen, setCarbonoModalOpen] = useState(false);
  const [carbonoData, setCarbonoData] = useState<CarbonoIncorporadoResponseDTO | null>(null);

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      carregarDadosIniciais();
    }
  }, [id]);

  const carregarDadosIniciais = async () => {
    if (!id || isNaN(Number(id))) return;

    dispatch(showLoading('Carregando dados do Projeto...'));
    setProjetoNaoEncontrado(false);

    try {
      const projetoId = Number(id);

      // Executar todas as requisições em paralelo
      const [projetoData, materiaisData] = await Promise.all([
        projetoService.getProjetoById(projetoId),
        materialProjetoService.buscarMateriaisComPropriedadesTermicas(projetoId)
      ]);

      setProjeto(projetoData);
      setMateriais(materiaisData);
      console.log('Materiais do projeto:', materiaisData);
    } catch (error) {
      console.error('Erro ao carregar dados do projeto:', error);
      setProjetoNaoEncontrado(true);
      setSnackbarMessage('Erro ao carregar dados do projeto');
      setSnackbarOpen(true);
    } finally {
      dispatch(hideLoading());
    }
  }

  const cancelarRemocao = () => {
    setMateriaisParaRemover([]);
    setDrawerRemocaoOpen(false);
  }

  const adicionarMaterialParaRemover = (material: MaterialVisualizacaoDTO) => {
    const jaExiste = materiaisParaRemover.some(m => m.id === material.id);
    if (!jaExiste) {
      setMateriaisParaRemover(prev => [...prev, material]);
      setSnackbarMessage(`${material.materialName} adicionado à lixeira`);
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('Material já está na lixeira');
      setSnackbarOpen(true);
    }
  }

  const removerMaterialDaLista = (materialId: number) => {
    setMateriaisParaRemover(prev => prev.filter(m => m.id !== materialId));
  }

  const confirmarRemocao = async () => {
    if (materiaisParaRemover.length === 0) {
      alert('Selecione pelo menos um material para remover.');
      return;
    }

    dispatch(showLoading('Removendo materiais do projeto...'));
    cancelarRemocao();

    try {
      // Chamar API para remover materiais
      for (const material of materiaisParaRemover) {
        await materialProjetoService.removerMaterialDoProjeto(material.id);
      }

      setSnackbarMessage(`${materiaisParaRemover.length} material(is) removido(s) com sucesso!`);
      setSnackbarOpen(true);

      // Recarregar materiais
      if (id) {
        const materiaisData = await materialProjetoService.buscarMateriaisComPropriedadesTermicas(Number(id));
        setMateriais(materiaisData);
      }

      // Limpar estados
      setMateriaisParaRemover([]);
    } catch (error) {
      console.error('Erro ao remover materiais:', error);
      setSnackbarMessage('Erro ao remover materiais. Tente novamente.');
      setSnackbarOpen(true);
    } finally {
      dispatch(hideLoading());
    }
  }

  const handleCalcularCarbonoIncorporado = async () => {
    if (!id) return;

    dispatch(showLoading('Calculando carbono incorporado...'));
    setSpeedDialOpen(false);

    try {
      const response = await calculoTermicoService.calcularCarbonoIncorporado(Number(id));
      setCarbonoData(response);
      setCarbonoModalOpen(true);

      setSnackbarMessage('Funcionalidade em desenvolvimento - API será implementada');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao calcular carbono incorporado:', error);
      setSnackbarMessage('Erro ao calcular carbono incorporado. Tente novamente.');
      setSnackbarOpen(true);
    } finally {
      dispatch(hideLoading());
    }
  };

  const actions = [
    {
      icon: <DeleteSweepIcon />,
      name: 'Remover Material',
      action: () => {
        setDrawerRemocaoOpen(true);
        setSpeedDialOpen(false);
      },
      color: 'error.main'
    },
    {
      icon: <ConstructionIcon />,
      name: 'Adicionar Material',
      action: () => {
        navigate('/materiais');
        setSpeedDialOpen(false);
      },
      color: 'success.main'
    },
    {
      icon: <AddCircleIcon />,
      name: 'Cadastrar Material',
      action: () => {
        setDrawerCadastroOpen(true);
        setSpeedDialOpen(false);
      },
      color: 'primary.main'
    },
    {
      icon: <Co2Icon />,
      name: 'Carbono Incorporado',
      action: handleCalcularCarbonoIncorporado,
      color: 'info.main'
    },
  ];





  if (projetoNaoEncontrado) {
    return (
      <Box sx={projetoSx}>
        <ResponsiveAppBar sx={appBarSxMaterialCategoria} />
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 2 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h5" color="error" fontWeight={700} gutterBottom>
              Projeto não encontrado
            </Typography>
            <Typography variant="body1" color="text.secondary">
              O projeto solicitado não existe ou foi removido.
            </Typography>
          </Paper>
        </Box>
      </Box>
    );
  }

  if (!projeto) {
    return null;
  }

  return (
    <Box sx={projetoSx}>
      <ResponsiveAppBar sx={appBarSxMaterialCategoria} />
      <Box sx={{ width: '100%', mt: 6, px: 3 }}>
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <CriarProjeto projeto={projeto} />
        </Box>

        <Typography variant="h6" color="success.main" sx={{ mt: 4, mb: 2 }}>
          Materiais adicionados ao projeto
        </Typography>
        {materiais.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum material adicionado a este projeto ainda.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {materiais.map((mat, index) => (
              <Box key={`${mat.materialName}-${index}`} sx={{ display: 'flex', marginRight: 5 }}>
                <MaterialCard
                  {...mat}
                  modoRemocao={true}
                  onRemove={() => adicionarMaterialParaRemover(mat)}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Speed Dial - Ações de Materiais */}
      <SpeedDial
        ariaLabel="Ações de materiais"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        icon={<SpeedDialIcon icon={<MoreVertIcon />} openIcon={<CloseIcon />} />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
            sx={{
              '& .MuiSpeedDialAction-staticTooltipLabel': {
                whiteSpace: 'nowrap',
              },
            }}
          />
        ))}
      </SpeedDial>

      {/* Badge para materiais a remover */}
      {materiaisParaRemover.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 32,
            zIndex: 999,
          }}
        >
          <Badge badgeContent={materiaisParaRemover.length} color="error" />
        </Box>
      )}


      {/* Drawer do Carrinho de Remoção */}
      <Drawer
        anchor="right"
        open={drawerRemocaoOpen}
        onClose={cancelarRemocao}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 420 },
            boxSizing: 'border-box',
            padding: '24px',
            background: '#fff3e0',
          },
        }}
      >
        {/* Header do Carrinho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 700 }}>
            Materiais para Remover
          </Typography>
          <IconButton onClick={cancelarRemocao} color="error">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Lista de Materiais para Remover */}
        <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
          {materiaisParaRemover.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <DeleteSweepIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Nenhum material selecionado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Clique no botão de remover nos cards dos materiais
              </Typography>
            </Box>
          ) : (
            materiaisParaRemover.map((material) => (
              <Card key={material.id} sx={{ mb: 2, display: 'flex', flexDirection: 'row', position: 'relative', borderLeft: '4px solid #d32f2f' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 120, objectFit: 'cover' }}
                  image={material.dataSourceUrl}
                  alt={material.materialName}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <CardContent sx={{ flex: '1 0 auto', pr: 6 }}>
                    <Typography component="div" variant="subtitle1" fontWeight={600} noWrap>
                      {material.materialName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {material.materialType}
                    </Typography>
                    <Typography variant="caption" color="error.main" sx={{ mt: 0.5, display: 'block' }}>
                      Densidade: {material.density} kg/m³
                    </Typography>
                  </CardContent>
                  <IconButton
                    aria-label="cancelar remoção"
                    onClick={() => removerMaterialDaLista(material.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'text.secondary',
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Card>
            ))
          )}
        </Box>

        {/* Footer - Total e Botões de Ação */}
        <Box sx={{ borderTop: '2px solid #d32f2f', pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="error.main" fontWeight={700}>
              {materiaisParaRemover.length} {materiaisParaRemover.length === 1 ? 'material' : 'materiais'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              size="large"
              onClick={cancelarRemocao}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              fullWidth
              size="large"
              startIcon={<DeleteIcon />}
              onClick={confirmarRemocao}
              disabled={materiaisParaRemover.length === 0}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Remover Materiais
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Drawer de Cadastro de Material */}
      <CadastrarMaterialDrawer
        open={drawerCadastroOpen}
        onClose={() => setDrawerCadastroOpen(false)}
        onMaterialCadastrado={carregarDadosIniciais}
      />

      {/* Modal de Carbono Incorporado */}
      <CarbonoIncorporadoModal
        open={carbonoModalOpen}
        onClose={() => setCarbonoModalOpen(false)}
        data={carbonoData}
      />

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box >
  );
}
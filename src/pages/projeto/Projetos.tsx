import { Add, Close, Edit, MoreVert } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Fab,
  IconButton,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../../components/header/ResponsiveAppBar';
import ModalConfirmacao from '../../components/modal/ModalConfirmacao';
import { botaoActionSx, botaoFluanteSx, cardActionsSx, cardProjetoSx, containerListProjetosSx, iconCardProjetoSx, titleProjetoSx } from '../../componentsSx/projeto/ProjetoSx';
import { projetoService } from '../../service/projetoService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { hideLoading, showLoading } from '../../store/slices/loadingSlice';
import { Colors } from '../../styles/Colors';
import '../../styles/projeto/Projetos.css';
import { appBarSxMaterialCategoria } from '../../styles/sx/AppBar';
import type { ProjetoDTO } from '../../types/projeto/projetoType';


export default function Projetos() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();


  const [projetosByUser, setProjetosByUser] = useState<ProjetoDTO[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projetoToDelete, setProjetoToDelete] = useState<ProjetoDTO | null>(null);


  const handleEditarProjeto = (id: number | undefined) => {
    navigate(`/projeto/${id}`);
  };

  const handleVerMais = (id: number | undefined) => {
    navigate(`/projeto/${id}`);
  };

  const handleNovoProjeto = () => {
    navigate('/projeto/novo');
  };


  useEffect(() => {
    if (user?.userId) {
      getProjetosByUser();
    }
  }, [user?.userId]);


  const getProjetosByUser = async () => {
    dispatch(showLoading('Carregando projetos...'));

    setTimeout(async () => {
      const userId = user?.userId;

      try {
        if (!userId) {
          console.error('Usuário não autenticado');
          return;
        }
        const response = await projetoService.getProjetosByUsuario(userId!);
        setProjetosByUser(response);
      } catch (error) {
        console.error('Erro ao buscar projetos do usuário:', error);
      } finally {
        dispatch(hideLoading());
      }
    }, 3000);
  }

  const handleOpenDeleteDialog = (projeto: ProjetoDTO) => {
    setProjetoToDelete(projeto);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setProjetoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!projetoToDelete?.id) return;

    dispatch(showLoading('Deletando projeto...'));
    handleCloseDeleteDialog();

    setTimeout(async () => {
      try {
        await projetoService.deleteProjeto(projetoToDelete.id!, user?.userId!);
        setProjetosByUser((prev) => prev.filter((projeto) => projeto.id !== projetoToDelete.id));
      } catch (error) {
        console.error('Erro ao deletar projeto:', error);
      } finally {
        dispatch(hideLoading());
      }
    }, 3000);
  };

  return (
    <Box sx={{ backgroundColor: Colors.fundo, minHeight: '100vh' }}>
      <ResponsiveAppBar sx={appBarSxMaterialCategoria} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={titleProjetoSx}
        >
          Seus projetos
        </Typography>

        <Box
          sx={containerListProjetosSx}
        >
          {projetosByUser.map((projeto) => (
            <Card
              key={projeto.id}
              sx={cardProjetoSx}
            >
              <IconButton
                sx={iconCardProjetoSx}
                size="small"
                onClick={() => handleOpenDeleteDialog(projeto)}
              >
                <Close fontSize="large" />
              </IconButton>

              <CardContent sx={{ pt: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: Colors.preto,
                    mb: 1,
                    textAlign: 'center',
                  }}
                >
                  {projeto.nome}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: Colors.cinzaTexto,
                    textAlign: 'center',
                    mb: 2,
                  }}
                >
                  {projeto.descricao}
                </Typography>
              </CardContent>

              <CardActions
                sx={cardActionsSx}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleEditarProjeto(projeto.id)}
                  sx={botaoActionSx}
                  startIcon={<Edit />}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleVerMais(projeto.id)}
                  sx={botaoActionSx}
                  startIcon={<MoreVert />}
                >
                  Ver mais
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleNovoProjeto}
        sx={botaoFluanteSx}
      >
        <Add />
      </Fab>
      <ModalConfirmacao
        openDeleteDialog={openDeleteDialog}
        projetoToDelete={projetoToDelete}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleConfirmDelete={handleConfirmDelete}
      ></ModalConfirmacao>
    </Box>
  );
}
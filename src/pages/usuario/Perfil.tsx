import { Close, Edit, Save } from '@mui/icons-material';
import { Alert, Avatar, Box, Button, IconButton, Paper, Snackbar, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import ResponsiveAppBar from '../../components/header/ResponsiveAppBar';
import { perfilCard, perfilContainer } from '../../componentsSx/usuario/PerfiLSx';
import { usuarioService } from '../../service/usuarioService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { hideLoading, showLoading } from '../../store/slices/loadingSlice';
import { appBarSxMaterialCategoria } from '../../styles/sx/AppBar';
import type { UsuarioDTO } from '../../types/usuario/user';

const usuarioFake = {
  nome: 'Usuário de Teste',
  email: 'usuario@bioedifica.com',
  foto: '/assets/img/avatar.png', // coloque uma imagem padrão ou do usuário
  projetos: [
    { id: 1, nome: 'Residência Sustentável' },
    { id: 2, nome: 'Galpão Industrial' },
  ],
  dataCadastro: '2024-03-15',
};

export default function Perfil() {
  const user = useAppSelector((state) => state.auth.user);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const dispatch = useAppDispatch();
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  useEffect(() => {
    getUsuarioById(user?.userId!);
  }, [user?.userId]);

  const atualizarUsuarioMutation = useMutation({
    mutationFn: async (data: { nome: string; email: string; senha?: string; }) => {
      const usuarioData: any = { nome: data.nome, email: data.email, id: user?.userId! };
      // Só adiciona senha se foi preenchida
      if (data.senha && data.senha.trim() !== '') {
        usuarioData.senha = data.senha;
      }
      const response = await atualizarUsuario(usuarioData);
      return response;
    },
    onSuccess: (data) => {
      displayMessageAtualizarUser('Perfil atualizado com sucesso!', 'success');
      setUsuario(data!);
      setIsEditing(false);
      dispatch(hideLoading());
    },
    onError: (error) => {
      dispatch(hideLoading());
      displayMessageAtualizarUser('Erro ao atualizar perfil. Tente novamente.', 'error');
      console.error('Erro ao atualizar perfil:', error);
    }
  });

  const getUsuarioById = async (id: number) => {
    dispatch(showLoading('Buscando Dados...'));

    setTimeout(async () => {
      try {
        const response = await usuarioService.buscarUsuarioPorId(id);
        setUsuario(response);
        setFormData({
          nome: response.nome,
          email: response.email,
          senha: ''
        });

      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      } finally {
        dispatch(hideLoading());
      }
    }, 3000);
  };

  const atualizarUsuario = async (newUsuario: UsuarioDTO) => {
    try {
      const response = await usuarioService.atualizarUsuario(newUsuario.id, newUsuario);
      return response;

    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (usuario) {
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        senha: ''
      });
    }
  };

  const handleSave = () => {
    dispatch(showLoading('Atualizando Usuário...'));
    atualizarUsuarioMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const displayMessageAtualizarUser = (mensagem: string, tipo: 'success' | 'error') => {
    setSnackbarMessage(mensagem);
    setSnackbarSeverity(tipo);
    setSnackbarOpen(true);
  };



  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <ResponsiveAppBar sx={appBarSxMaterialCategoria} />

      {usuario && (
        <Box sx={perfilContainer}>
          <Paper
            elevation={2}
            sx={{ ...perfilCard, position: 'relative' }}
          >
            {!isEditing && (
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <IconButton
                  onClick={handleEdit}
                  sx={{
                    bgcolor: '#f0f0f0',
                    '&:hover': { bgcolor: '#e0e0e0' },
                    width: 40,
                    height: 40
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Box>
            )}

            <Avatar
              src={usuarioFake.foto}
              alt={usuarioFake.nome}
              sx={{
                width: 120,
                height: 120,
                bgcolor: '#e0e0e0',
                fontSize: 48,
                color: '#333',
                border: '4px solid #f0f0f0'
              }}
            >
              {(usuario?.nome || 'U')[0].toUpperCase()}
            </Avatar>

            {!isEditing ? (
              <>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="#333"
                  textAlign="center"
                >
                  {usuario?.nome}
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                >
                  {usuario?.email}
                </Typography>
              </>
            ) : (
              <>
                <TextField
                  label="Nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                />

                <TextField
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="email"
                  sx={{ mt: 2 }}
                />

                <TextField
                  label="Nova Senha (deixe em branco para manter a atual)"
                  value={formData.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="password"
                  placeholder="Digite uma nova senha ou deixe em branco"
                  helperText="Preencha apenas se desejar alterar a senha"
                  sx={{ mt: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={atualizarUsuarioMutation.isPending}
                    sx={{ flex: 1 }}
                  >
                    {atualizarUsuarioMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={handleCancel}
                    sx={{ flex: 1 }}
                  >
                    Cancelar
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      )}
      <Box sx={{ textAlign: 'center', mt: 6, color: '#388e3c' }}>
        <Typography variant="caption">
          © {new Date().getFullYear()} BioEdifica — Construção Sustentável e Inteligente
        </Typography>
      </Box>
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
    </Box>
  );
}
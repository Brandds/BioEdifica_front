import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import imagemCadastro from '../assets/img/imagem_cadastro_usuario.jpg';
import { buttonCadastroSx, campoEmailCadastroSx, campoNomeCadastroSx, campoSenhaCadastroSx, linkTenhoContaCadastroSx } from '../componentsSx/usuario/CadastroSx';
import { useAppDispatch } from '../store/hooks';
import { registerUser } from '../store/slices/authSlice';
import { Colors } from '../styles/Colors';
import '../styles/Usuario/Cadastro.css';
import type { UserRole } from '../types/usuario/user';

export type CadastroForm = {
  nome: string;
  sobrenome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  perfil: UserRole;

};

export default function Cadastro() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  const { control, handleSubmit, watch, formState: { errors } } = useForm<CadastroForm>();

  const mutation = useMutation({
    mutationFn: async (data: CadastroForm) => {
      const response = await dispatch(registerUser(data)).unwrap();
      return response;
    },
    onSuccess: () => {
      exibirMensagemSnackbar('Cadastro realizado com sucesso! Redirecionando para o login...', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    },
    onError: (error: any) => {
      const status = error?.status;

      if (status === 409) {
        exibirMensagemSnackbar('Este email já está cadastrado! Tente fazer login ou use outro email.', 'error');
      } else {
        exibirMensagemSnackbar('Erro ao cadastrar. Tente novamente.', 'error');
      }
    }
  });

  function onSubmit(data: CadastroForm) {
    mutation.mutate(data);
  }

  const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const exibirMensagemSnackbar = (mensagem: string, severidade: 'success' | 'error') => {
    setSnackbarMessage(mensagem);
    setSnackbarSeverity(severidade);
    setSnackbarOpen(true);
  }

  return (
    <div className="cadastro-page">
      <div className="cadastro-left">
        <img src={imagemCadastro} alt="BioEdifica - Cadastro de Usuário" />
      </div>
      <div className="cadastro-right">
        <div className="cadastro-card">
          <Typography variant="h4" component="h1" sx={{
            color: Colors.preto,
            fontWeight: 700,
            mb: 4,
            textAlign: 'center'
          }}>
            Criar uma conta
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            {/* Nome e Sobrenome na mesma linha */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="nome"
                  control={control}
                  rules={{ required: 'Nome obrigatório' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome"
                      placeholder="Seu nome"
                      autoComplete="given-name"
                      error={!!errors.nome}
                      helperText={errors.nome?.message}
                      fullWidth
                      variant="outlined"
                      sx={campoNomeCadastroSx}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="sobrenome"
                  control={control}
                  rules={{ required: 'Sobrenome obrigatório' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Sobrenome"
                      placeholder="Seu sobrenome"
                      autoComplete="family-name"
                      error={!!errors.sobrenome}
                      helperText={errors.sobrenome?.message}
                      fullWidth
                      variant="outlined"
                      sx={campoNomeCadastroSx}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {/* Email */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'E-mail obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'E-mail inválido'
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Endereço de email"
                  type="email"
                  placeholder="usuario@bioedifica.com"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  variant="outlined"
                  sx={campoEmailCadastroSx}
                />
              )}
            />
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="senha"
                  control={control}
                  rules={{
                    required: 'Senha obrigatória',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Senha"
                      type="password"
                      placeholder="Crie uma senha"
                      autoComplete="new-password"
                      error={!!errors.senha}
                      helperText={errors.senha?.message}
                      fullWidth
                      variant="outlined"
                      sx={campoSenhaCadastroSx}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="confirmarSenha"
                  control={control}
                  rules={{
                    required: 'Confirme sua senha',
                    validate: (value: string) => value === watch('senha') || 'As senhas não coincidem'
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirme a senha"
                      type="password"
                      placeholder="Repita a senha"
                      autoComplete="new-password"
                      error={!!errors.confirmarSenha}
                      helperText={errors.confirmarSenha?.message}
                      fullWidth
                      variant="outlined"
                      sx={campoSenhaCadastroSx}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              name="perfil"
              control={control}
              rules={{ required: 'Selecione um perfil' }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.perfil}
                  sx={campoEmailCadastroSx}
                >
                  <InputLabel>Perfil Profissional</InputLabel>
                  <Select
                    {...field}
                    label="Perfil Profissional"
                    value={field.value || ''}
                  >
                    <MenuItem value="ARQUITETO">Arquiteto</MenuItem>
                    <MenuItem value="ENGENHEIRO">Engenheiro</MenuItem>
                    <MenuItem value="GESTOR_PUBLICO">Gestor Público</MenuItem>
                    <MenuItem value="PROFESSOR">Professor</MenuItem>
                    <MenuItem value="TECNICO_EDIFICACOES">Técnico em Edificações</MenuItem>
                    <MenuItem value="CONSULTOR_SUSTENTABILIDADE">Consultor em Sustentabilidade</MenuItem>
                    <MenuItem value="ESTUDANTE">Estudante</MenuItem>
                  </Select>
                  {errors.perfil && (
                    <FormHelperText>{errors.perfil.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            {/* Botão Cadastrar */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              fullWidth
              variant="contained"
              sx={buttonCadastroSx}
            >
              {mutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
            </Button>

            {/* Link Já tenho conta */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Button
                variant="text"
                onClick={() => navigate('/')}
                sx={linkTenhoContaCadastroSx}
              >
                Já tenho conta
              </Button>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: Colors.cinzaTexto, fontSize: '0.95rem' }}>
                © {new Date().getFullYear()} BioEdifica — Construção Sustentável e Inteligente
              </Typography>
            </Box>
          </Box>
        </div>
      </div>
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
    </div>
  );
}
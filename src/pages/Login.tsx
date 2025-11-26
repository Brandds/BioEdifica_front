import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import imagemLogin from '../assets/img/imagem_login.jpg';
import logoTexto from '../assets/img/‎imagem_logo_texto_bioEdifica.png';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../store/slices/authSlice';
import { hideLoading, showLoading } from '../store/slices/loadingSlice';
import { Colors } from '../styles/Colors';
import '../styles/Usuario/Login.css';
import type { LoginCredentials } from '../types/usuario/auth';

type LoginForm = {
  email: string;
  senha: string;
};

const schema = yup.object({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  senha: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha obrigatória'),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(schema)
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');

  const mutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const loginData: LoginCredentials = {
        email: data.email,
        password: data.senha,
      };

      dispatch(showLoading('Verificando credenciais...'));
      const response = await dispatch(loginUser(loginData)).unwrap();
      return response;
    },
    onSuccess: (data) => {
      console.log('Login bem-sucedido!', data);
      setSnackbarMessage('Login realizado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/materiais');
    },
    onError: (error: any) => {
      let errorMessage = 'Erro ao fazer login';

      if (typeof error === 'object' && error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    },
    onSettled: () => {
      dispatch(hideLoading());
    },
  });

  function onSubmit(data: LoginForm) {
    mutation.mutate(data);
  }

  const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-card">
          <header>
            <img src={logoTexto} alt="BioEdifica" className="logo-texto" />
          </header>
          <Box component="form" className="login-form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="E-mail"
                  type="email"
                  placeholder="usuario@bioedifica.com"
                  autoComplete="username"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  variant="outlined"
                  sx={{
                    mb: 2,
                    '& .MuiInputLabel-root': {
                      color: Colors.preto,
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: Colors.branco,
                      '&:hover fieldset': {
                        borderColor: Colors.verdePrincipal,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.verdePrincipal,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: Colors.verdePrincipal,
                    },
                  }}
                />
              )}
            />

            <Controller
              name="senha"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  error={!!errors.senha}
                  helperText={errors.senha?.message}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiInputLabel-root': {
                      color: Colors.preto,
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: Colors.branco,
                      '&:hover fieldset': {
                        borderColor: Colors.verdePrincipal,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: Colors.verdePrincipal,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: Colors.verdePrincipal,
                    },
                  }}
                />
              )}
            />
            <Button
              type="submit"
              disabled={mutation.isPending}
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                background: `linear-gradient(90deg, ${Colors.verdeEscuro} 60%, ${Colors.verdeClaro} 100%)`,
                '&:hover': {
                  background: `linear-gradient(90deg, ${Colors.verdePrincipal} 60%, ${Colors.verdeEscuro} 100%)`,
                },
                '&:disabled': {
                  background: Colors.cinzaTexto,
                },
              }}
            >
              {mutation.isPending ? 'Entrando...' : 'Entrar'}
            </Button>

            <Box className="login-links" sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="body2" sx={{ color: Colors.cinzaTexto }}>
                  Não tem uma conta?
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate('/cadastro')}
                  sx={{
                    color: Colors.verdeEscuro,
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textTransform: 'none',
                    padding: '2px 4px',
                    minWidth: 'auto',
                    '&:hover': {
                      color: Colors.verdePrincipal,
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Criar nova conta
                </Button>
              </Box>
              <Button
                variant="text"
                onClick={() => navigate('/esqueci-senha')}
                sx={{
                  color: Colors.cinzaTexto,
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textTransform: 'none',
                  padding: '2px 4px',
                  '&:hover': {
                    color: Colors.preto,
                    backgroundColor: 'transparent',
                  },
                }}
              >
                Esqueceu a senha?
              </Button>
            </Box>
          </Box>
          <Box component="footer" sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: Colors.cinzaTexto, fontSize: '0.95rem' }}>
              © {new Date().getFullYear()} BioEdifica — Construção Sustentável e Inteligente
            </Typography>
          </Box>
        </div>
      </div>
      <div className="login-right">
        <img src={imagemLogin} alt="BioEdifica - Construção Sustentável" />
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

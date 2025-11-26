import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import imagemNotFound from '../../assets/img/404.png';
import { useAppSelector } from '../../store/hooks';
import { perfilSx } from '../../styles/sx/usuario/UsuserSx';

export default function NotFound() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleVoltar = () => {
    // Se estiver autenticado, vai para /materiais, senão vai para /login
    if (isAuthenticated) {
      navigate('/materiais');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box sx={perfilSx}>
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 10, textAlign: 'center' }}>
        <img
          src={imagemNotFound}
          alt="Página não encontrada"
          style={{ width: '120%', minWidth: 400, maxWidth: 420, marginBottom: 32, height: "50%" }}
        />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Página não encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          O endereço que você tentou acessar não existe ou foi removido.
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={handleVoltar}
        >
          {isAuthenticated ? 'Voltar para Materiais' : 'Ir para Login'}
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 6, color: '#388e3c' }}>
        <Typography variant="caption">
          © {new Date().getFullYear()} BioEdifica — Construção Sustentável e Inteligente
        </Typography>
      </Box>
    </Box>
  );
}
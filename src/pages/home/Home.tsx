import { Folder, Home as HomeIcon, Search } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import imagemFundo from '../../assets/img/imagem_sobre.png';
import logoTexto from '../../assets/img/‎imagem_logo_texto_bioEdifica.png';
import { Colors } from '../../styles/Colors';

export default function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Box>
      {/* Primeira seção - Tela completa com imagem de fundo */}
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          backgroundImage: `url(${imagemFundo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            padding: '10px 0',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src={logoTexto}
                alt="bioEdifica"
                sx={{ height: '40px' }}
              />
            </Box>
            <Button
              variant="outlined"
              onClick={handleLoginClick}
              sx={{
                color: Colors.branco,
                borderColor: Colors.branco,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: Colors.branco,
                },
              }}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>

        {/* Conteúdo central */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            textAlign: 'left',
            px: 6,
            pt: 8,
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                color: Colors.branco,
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' },
              }}
            >
              Construa o Futuro Sustentável
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: Colors.branco,
                maxWidth: '600px',
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              Otimize o desempenho térmico e reduza o impacto ambiental das suas edificações com dados confiáveis e cálculos automatizados.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Segunda seção - Funcionalidades */}
      <Box sx={{ backgroundColor: Colors.branco, py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'left',
              mb: 6,
              fontWeight: 'bold',
              color: Colors.preto,
            }}
          >
            Funcionalidades
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              justifyContent: 'center',
            }}
          >
            {/* Card 1 */}
            <Box sx={{ flex: 1, maxWidth: { md: '300px' } }}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 3,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: Colors.verdeBioEdifica,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <HomeIcon sx={{ fontSize: 40, color: Colors.branco }} />
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 2, color: Colors.preto }}
                  >
                    Conheça os principais materiais
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Card 2 */}
            <Box sx={{ flex: 1, maxWidth: { md: '300px' } }}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 3,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: Colors.verdeBioEdifica,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Folder sx={{ fontSize: 40, color: Colors.branco }} />
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 2, color: Colors.preto }}
                  >
                    Monte seus projetos
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Card 3 */}
            <Box sx={{ flex: 1, maxWidth: { md: '300px' } }}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: 3,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: Colors.verdeBioEdifica,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Search sx={{ fontSize: 40, color: Colors.branco }} />
                </Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', mb: 2, color: Colors.preto }}
                  >
                    Pesquise sobre os principais materiais
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Terceira seção - Sobre */}
      <Box
        sx={{
          backgroundColor: Colors.verdeBioEdifica,
          py: 8,
          px: 3,
          borderTopLeftRadius: '50px',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body1"
            sx={{
              color: Colors.branco,
              textAlign: 'center',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            O BioEdifica é uma solução tecnológica inovadora voltada para arquitetos, engenheiros e gestores
            públicos de construções civil. Desenvolvida para simplificar e integrar o cumprimento das normas
            brasileiras de desempenho térmico como a NBT 15220-2 e NBR 15220-3, a plataforma bioEdifica
            moderniza a gestão e análise de materiais de construção sustentáveis, promovendo eficiência energética.
          </Typography>
          <br />
          <Typography
            variant="body1"
            sx={{
              color: Colors.branco,
              textAlign: 'center',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Nosso objetivo é democratizar o acesso a projetos sustentáveis, oferecendo dados confiáveis sobre
            conforto térmico, inércia térmica através de cálculo automatizadas e dados localizados para o contexto brasileiro. A BioEdifica apoia desde projetos
            residenciais até obras políticas, promovendo edificações mais eficientes, sensíveis e alinhadas aos
            Objetivos de Desenvolvimento Sustentável (ODS).
          </Typography>
        </Container>
        <Box component="footer" sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: Colors.branco, fontSize: '0.95rem' }}>
            © {new Date().getFullYear()} BioEdifica — Construção Sustentável e Inteligente
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
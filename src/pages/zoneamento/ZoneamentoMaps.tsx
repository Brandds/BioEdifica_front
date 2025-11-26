import { Alert, Box, Container, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import AccordionExpandIcon from "../../components/AccordionExpandIcon";
import ResponsiveAppBar from "../../components/header/ResponsiveAppBar";
import CardFormZoneamento from "../../components/zoneamento/CardFormZoneamento";
import ListaCidadesSistema from "../../components/zoneamento/ListaCidadesSistema";
import { zoneamentoBiografia, zoneamentoBiografiaSx, zoneamentoBoxMapsSx, zoneamentoBoxPosContainerSx, zoneamentoContainerSx } from "../../componentsSx/zoneamentoSx/ZoneamentoMapsSx,";
import { mensagensConstants } from "../../constants/messagens";
import { appBarSxMaterialCategoria } from "../../styles/sx/AppBar";



export default function ZoneamentoMaps() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');
  const [recarregarCidades, setRecarregarCidades] = useState(0);

  const handleCloseSnackbar = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  const exibirMensagem = (mensagem: string, severidade: 'success' | 'error') => {
    setSnackbarMessage(mensagem);
    setSnackbarSeverity(severidade);
    setSnackbarOpen(true);
  }

  const handleCidadeCriada = () => {
    setRecarregarCidades(prev => prev + 1);
  }

  return (
    <Box sx={zoneamentoBoxMapsSx}>
      <ResponsiveAppBar sx={appBarSxMaterialCategoria} />
      <Container
        maxWidth={false}
        sx={zoneamentoContainerSx}
      >
        <Box
          sx={zoneamentoBoxPosContainerSx}>
          <Box sx={{ justifyContent: 'center', width: '100%' }}>
            <Typography sx={zoneamentoBiografiaSx}>Mapa de Zoneamento</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: 'center', mt: 1, mb: 2, px: 2 }}
            >
              Localize sua cidade no mapa e identifique a zona bioclimática correspondente pela cor da região.
              Cada zona possui características climáticas específicas que influenciam nas recomendações construtivas.
            </Typography>
          </Box>
          <iframe
            src="https://www.google.com/maps/d/embed?mid=15RWtxt9hbEwoOmxuPQ4zwdDsbCVu4Ds&ehbc=2E312F"
            width="100%"
            height="80%"
            title="Mapa de Zoneamento Bioclimático do Brasil"
          >
          </iframe>
        </Box>
        <Box sx={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, mb: 4 }}>
          <AccordionExpandIcon
            title="Caso não encontre sua cidade no sistema"
            subTitle={mensagensConstants.AVISO_CASO_NAO_TENHA_CIDADE}
          >
            <CardFormZoneamento exibirMensagem={exibirMensagem} onCidadeCriada={handleCidadeCriada} />
          </AccordionExpandIcon>
          <AccordionExpandIcon
            title="Cidades vinculadas no sistema"
            subTitle={mensagensConstants.AVISO_CIDADES_DO_SISTEMA}
          >
            <ListaCidadesSistema key={recarregarCidades} />
          </AccordionExpandIcon>
        </Box>
      </Container>

      <Box sx={zoneamentoBiografia}>
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
  )
}
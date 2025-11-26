import { Box } from '@mui/material';
import ResponsiveAppBar from '../../components/header/ResponsiveAppBar';
import CriarProjeto from '../../components/projeto/CriarProjeto';
import { appBarSxMaterialCategoria } from '../../styles/sx/AppBar';
import { projetoSx } from '../../styles/sx/projeto/ProjetoSx';

export default function ProjetoNovo() {
  return (
    <Box sx={projetoSx}>
      <ResponsiveAppBar sx={appBarSxMaterialCategoria} />
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, p: 2, }}>
        <CriarProjeto />
      </Box>
    </Box>
  );
}
import { Box, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { buttonDetalhesSx, materialCardDetalhesSx, materialCardImagemSx, materialCardSx } from '../../componentsSx/material/MaterialCategoriaCardSx';
import type { MaterialCategoriaDTO } from '../../types/material/materialType';

interface MaterialCategoriaCardProps extends MaterialCategoriaDTO {
  onVerMateriais?: (tipoMaterial: string) => void;
}

export function MaterialCategoriaCard(props: MaterialCategoriaCardProps) {
  const [hover, setHover] = useState(false);

  const handleVerMateriais = () => {
    if (props.onVerMateriais) {
      props.onVerMateriais(props.tipoMaterial);
    }
  };

  return (
    <Box
      className="material-card"
      sx={materialCardSx}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 160,
          overflow: 'hidden',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Box
          component="img"
          src={props.urlImagem}
          alt={props.tipoMaterial}
          sx={materialCardImagemSx}
        />
        {hover && (
          <Box
            sx={materialCardDetalhesSx}
          >
            <Button
              variant="contained"
              color="success"
              sx={buttonDetalhesSx}
              onClick={handleVerMateriais}
            >
              Ver materiais da categoria
            </Button>
          </Box>
        )}
      </Box>
      <Box className="material-info" sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h6" sx={{ color: 'var(--verde-principal)' }}>
          {props.tipoMaterial}
        </Typography>
        {true && (
          <Typography variant="body2" sx={{ color: 'var(--cinza-texto)' }}>
            {props.quantidade} materiais encontrados
          </Typography>
        )}
        <Box className="material-metricas" sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'var(--verde-escuro)' }}>Tipo de produto {props.tipoProduto}</Typography>
          <Typography variant="body2" sx={{ color: 'var(--verde-escuro)' }}>Tipo de família {props.tipoFamiliaMaterial}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
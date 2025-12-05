import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialCardBoxContainerImagemSx, MaterialCardBoxImgemSx, MaterialCardBoxInformacaoBottonsSx, MaterialCardBoxInformacaoFooterSx, MaterialCardBoxInformacaoFooterTitlesSx, MaterialCardBoxInformacaoSx, MaterialCardButtonDetalhesSx, MaterialCardContainerSx, MaterialCardImagemSx, MaterialCardInformacaoBottonsSx, MaterialCardTitleInformacaoSx } from '../../componentsSx/material/MaterialCard';
import type { MaterialVisualizacaoDTO } from '../../types/material/materialType';

interface MaterialCardProps extends MaterialVisualizacaoDTO {
  onClick?: () => void;
  onAddToCart?: () => void;
  modoRemocao?: boolean;
  onRemove?: () => void;
}

export function MaterialCard(props: MaterialCardProps) {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      className="material-card"
      sx={MaterialCardContainerSx}
      onClick={props.onClick}
    >
      <Box
        sx={MaterialCardBoxContainerImagemSx}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Box
          component="img"
          src={props.dataSourceUrl}
          alt={props.materialName}
          sx={MaterialCardBoxImgemSx(hover)}
        />
        {hover && (
          <Box
            sx={MaterialCardImagemSx}
          >
            <Button
              variant="contained"
              color="success"
              sx={MaterialCardButtonDetalhesSx}
              onClick={(e) => {
                e.stopPropagation();
                const id = props.idMaterialExterno ? props.idMaterialExterno : props.id;
                navigate(`/material/${id}`);
              }}
            >
              Ver Detalhes
            </Button>
            {props.onAddToCart && !props.modoRemocao && (
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<TuneIcon />}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(76, 175, 80, 0.95)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  px: 1.5,
                  py: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 1)',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onAddToCart?.();
                }}
              >
                Adicionar Configuração
              </Button>
            )}
            {props.modoRemocao && props.onRemove && (
              <IconButton
                color="error"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 1)',
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onRemove?.();
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      <Box sx={MaterialCardBoxInformacaoSx}>
        <Typography
          variant="h6"
          sx={MaterialCardTitleInformacaoSx}
        >
          {props.materialName}
        </Typography>

        <Box sx={MaterialCardBoxInformacaoBottonsSx}>
          <Chip
            label={props.materialType}
            size="small"
            sx={MaterialCardInformacaoBottonsSx}
          />
          <Chip
            label={props.materialTypeFamily}
            size="small"
            sx={MaterialCardInformacaoBottonsSx}
          />
        </Box>

        <Box sx={MaterialCardBoxInformacaoFooterSx}>
          <Typography variant="body2" sx={MaterialCardBoxInformacaoFooterTitlesSx}>
            Densidade:
          </Typography>
          <Typography variant="body2" sx={MaterialCardBoxInformacaoFooterTitlesSx}>
            {props.density ? `${props.density} kg/m³` : 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
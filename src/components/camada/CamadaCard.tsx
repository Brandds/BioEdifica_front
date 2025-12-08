import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LayersIcon from '@mui/icons-material/Layers';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, Chip, IconButton, Stack, Typography } from '@mui/material';
import type { CamadaResponseDTO } from '../../types/camada/camadaType';

interface CamadaCardProps {
  camada: CamadaResponseDTO;
  onDelete?: (camadaId: number) => void;
}

export function CamadaCard({ camada, onDelete }: CamadaCardProps) {
  const getTipoCamadaColor = (tipo: string) => {
    switch (tipo) {
      case 'PAREDE': return 'primary';
      case 'PISO': return 'secondary';
      case 'COBERTURA': return 'success';
      default: return 'default';
    }
  };

  const formatarValor = (valor: number, unidade: string) => {
    return `${valor.toFixed(4)} ${unidade}`;
  };

  return (
    <Card sx={{ mb: 2, borderLeft: 4, borderColor: `${getTipoCamadaColor(camada.tipoCamada)}.main` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LayersIcon color={getTipoCamadaColor(camada.tipoCamada)} />
            <Typography variant="h6" fontWeight={600}>
              {camada.nome}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={camada.tipoCamada}
              color={getTipoCamadaColor(camada.tipoCamada)}
              size="small"
            />
            {onDelete && (
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(camada.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Propriedades Térmicas */}
        {camada.calculoTermico ? (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Propriedades Térmicas
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Transmitância Térmica (U):</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatarValor(camada.calculoTermico.transmitanciaTermica, 'W/(m².K)')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Capacidade Térmica (CT):</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatarValor(camada.calculoTermico.capacidadeTermica, 'kJ/(m².K)')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Atraso Térmico (φ):</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatarValor(camada.calculoTermico.atrasoTermico, 'h')}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
            <Typography variant="body2" color="warning.dark">
              ⚠️ Propriedades térmicas não calculadas. Use o endpoint de criação de camada com cálculo.
            </Typography>
          </Box>
        )}

        {/* Materiais da Camada */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">
              Materiais ({camada.materiais.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1.5}>
              {camada.materiais.map((material, index) => (
                <Box
                  key={material.materialProjetoId}
                  sx={{
                    p: 1.5,
                    bgcolor: index % 2 === 0 ? 'grey.50' : 'white',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {material.ordem}. {material.materialName}
                    </Typography>
                    <Chip label={`${material.espessura} cm`} size="small" variant="outlined" />
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Condutividade
                      </Typography>
                      <Typography variant="caption" display="block" fontWeight={600}>
                        {material.condutividadeTermica.toFixed(4)} W/(m.K)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Densidade
                      </Typography>
                      <Typography variant="caption" display="block" fontWeight={600}>
                        {material.densidade.toFixed(2)} kg/m³
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Calor Específico
                      </Typography>
                      <Typography variant="caption" display="block" fontWeight={600}>
                        {material.calorEspecifico.toFixed(2)} kJ/(kg.K)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}

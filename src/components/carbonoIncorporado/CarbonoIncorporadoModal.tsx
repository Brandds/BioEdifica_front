import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CarbonoIncorporadoResponseDTO } from '../../types/carbonoIncorporado/carbonoIncorporadoType';

interface CarbonoIncorporadoModalProps {
  open: boolean;
  onClose: () => void;
  data: CarbonoIncorporadoResponseDTO | null;
}

export default function CarbonoIncorporadoModal({ open, onClose, data }: CarbonoIncorporadoModalProps) {
  if (!data) return null;

  const handleExportarPDF = () => {
    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    // Título Principal
    doc.setFontSize(20);
    doc.setTextColor(46, 125, 50); // Verde
    doc.text('Relatório de Carbono Incorporado', 105, 20, { align: 'center' });

    // Nome do Projeto
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(data.nomeProjeto, 105, 30, { align: 'center' });

    // Data
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data: ${dataAtual}`, 105, 37, { align: 'center' });

    // Linha divisória
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // Resumo Geral
    doc.setFontSize(14);
    doc.setTextColor(46, 125, 50);
    doc.text('Resumo Geral', 20, 50);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Área Total do Projeto: ${data.areaTotalProjeto.toFixed(2)} m²`, 20, 60);
    doc.text(`Quantidade de Materiais: ${data.quantidadeMateriais}`, 20, 67);

    doc.setFontSize(12);
    doc.setTextColor(46, 125, 50);
    doc.text(`Carbono Total por Área: ${data.carbonoTotalPorArea.toFixed(2)} kgCO₂eq/m²`, 20, 77);
    doc.setTextColor(33, 150, 243); // Azul
    doc.text(`Carbono Total Absoluto: ${data.carbonoTotalAbsoluto.toFixed(2)} kgCO₂eq`, 20, 84);

    // Tabela de Materiais Detalhados
    doc.setFontSize(14);
    doc.setTextColor(46, 125, 50);
    doc.text('Detalhamento por Material', 20, 95);

    autoTable(doc, {
      startY: 100,
      head: [['Material', 'Tipo', 'Espessura\n(m)', 'Densidade\n(kg/m³)', 'Massa/m²\n(kg/m²)', 'CO₂/kg\n(kgCO₂eq/kg)', 'Carbono Total\n(kgCO₂eq)']],
      body: data.materiaisDetalhados.map(m => [
        m.nomeMaterial,
        m.tipoMaterial,
        m.espessura.toFixed(3),
        m.densidade.toFixed(2),
        m.massaPorUnidade.toFixed(2),
        m.co2PorKg.toFixed(3),
        m.carbonoTotalMaterial.toFixed(2)
      ]),
      headStyles: {
        fillColor: [76, 175, 80], // Verde
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 40, halign: 'left' },
        1: { cellWidth: 30, halign: 'left' },
        2: { cellWidth: 18 },
        3: { cellWidth: 22 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 }
      },
      margin: { left: 20, right: 20 }
    });

    // Verificar se precisa adicionar nova página
    const finalY = (doc as any).lastAutoTable.finalY || 100;

    if (finalY > 230) {
      doc.addPage();
      var nextY = 20;
    } else {
      var nextY = finalY + 15;
    }

    // Tabela de Fases do Ciclo de Vida (LCA)
    doc.setFontSize(14);
    doc.setTextColor(46, 125, 50);
    doc.text('Fases do Ciclo de Vida (LCA)', 20, nextY);

    autoTable(doc, {
      startY: nextY + 5,
      head: [['Material', 'A1-A3 Produção\n(kgCO₂eq/kg)', 'C1-C4 Fim de Vida\n(kgCO₂eq/kg)', 'Biogênico\n(kgCO₂eq/kg)']],
      body: data.materiaisDetalhados.map(m => [
        m.nomeMaterial,
        m.carbonoA1A3?.toFixed(3) || 'N/A',
        m.carbonoC1C4?.toFixed(3) || 'N/A',
        m.carbonoBiogenico?.toFixed(3) || 'N/A'
      ]),
      headStyles: {
        fillColor: [33, 150, 243], // Azul
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 70, halign: 'left' },
        1: { cellWidth: 35 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 }
      },
      margin: { left: 20, right: 20 }
    });

    // Rodapé
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        105,
        287,
        { align: 'center' }
      );
      doc.text(
        'BioEdifica - Sistema de Avaliação de Carbono Incorporado',
        105,
        292,
        { align: 'center' }
      );
    }

    // Salvar PDF
    const nomeArquivo = `relatorio-carbono-${data.nomeProjeto.replace(/\s+/g, '-').toLowerCase()}-${dataAtual.replace(/\//g, '-')}.pdf`;
    doc.save(nomeArquivo);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'success.main',
          color: 'white',
          py: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Carbono Incorporado - {data.nomeProjeto}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Conteúdo */}
      <DialogContent sx={{ p: 3 }}>
        {/* Resumo Geral */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" color="success.main" fontWeight={600} gutterBottom>
            Resumo Geral
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Área Total do Projeto
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {data.areaTotalProjeto.toFixed(2)} m²
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Quantidade de Materiais
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {data.quantidadeMateriais}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Carbono Total por Área
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {data.carbonoTotalPorArea.toFixed(2)} kgCO₂eq/m²
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Carbono Total Absoluto
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {data.carbonoTotalAbsoluto.toFixed(2)} kgCO₂eq
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Tabela de Materiais Detalhados */}
        <Typography variant="h6" color="text.primary" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
          Detalhamento por Material
        </Typography>
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'success.light' }}>
                <TableCell sx={{ fontWeight: 700, color: 'white' }}>Material</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">Tipo</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">Espessura (m)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">Densidade (kg/m³)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">Massa/m² (kg/m²)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">CO₂/kg (kgCO₂eq/kg)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">Carbono Total (kgCO₂eq)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.materiaisDetalhados.map((material, index) => (
                <TableRow
                  key={material.idMaterialMock}
                  sx={{
                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                    '&:hover': { bgcolor: 'action.selected' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {material.nomeMaterial}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption" color="text.secondary">
                      {material.tipoMaterial}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{material.espessura.toFixed(3)}</TableCell>
                  <TableCell align="right">{material.densidade.toFixed(2)}</TableCell>
                  <TableCell align="right">{material.massaPorUnidade.toFixed(2)}</TableCell>
                  <TableCell align="right">{material.co2PorKg.toFixed(3)}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {material.carbonoTotalMaterial.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Detalhamento de Fases do Carbono */}
        <Typography variant="h6" color="text.primary" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
          Fases do Ciclo de Vida (LCA)
        </Typography>
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell sx={{ fontWeight: 700, color: 'white' }}>Material</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">A1-A3 Produção (kgCO₂eq/kg)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">C1-C4 Fim de Vida (kgCO₂eq/kg)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'white' }} align="right">Biogênico (kgCO₂eq/kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.materiaisDetalhados.map((material) => (
                <TableRow
                  key={`lca-${material.idMaterialMock}`}
                  sx={{
                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {material.nomeMaterial}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{material.carbonoA1A3?.toFixed(3) || 'N/A'}</TableCell>
                  <TableCell align="right">{material.carbonoC1C4?.toFixed(3) || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      color={material.carbonoBiogenico && material.carbonoBiogenico < 0 ? 'success.main' : 'text.primary'}
                      fontWeight={material.carbonoBiogenico && material.carbonoBiogenico < 0 ? 600 : 400}
                    >
                      {material.carbonoBiogenico?.toFixed(3) || 'N/A'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      {/* Footer - Ações */}
      <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          size="large"
          sx={{ px: 4 }}
        >
          Fechar
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleExportarPDF}
          size="large"
          sx={{ px: 4 }}
        >
          Exportar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
}

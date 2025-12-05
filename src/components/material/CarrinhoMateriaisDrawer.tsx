import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SettingsIcon from '@mui/icons-material/Settings';
import { Alert, Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Snackbar, TextField, Typography } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { calculoTermicoService } from '../../service/calculoTermicoService';
import { materialProjetoService } from '../../service/materialProjetoService';
import { projetoService } from '../../service/projetoService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { atualizarEspessura, limparCarrinho, removerMaterial, setTipoCamada } from '../../store/slices/carrinhoSlice';
import type { CalculoTermicoResponseDTO } from '../../types/calculoTermico/calculoTermicoType';
import type { MaterialVisualizacaoDTO } from '../../types/material/materialType';
import type { ProjetoDTO } from '../../types/projeto/projetoType';

interface MaterialComEspessura extends MaterialVisualizacaoDTO {
  espessura: number;
  ordem: number;
}

interface CarrinhoMateriaisDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CarrinhoMateriaisDrawer({
  open,
  onClose
}: CarrinhoMateriaisDrawerProps) {
  const dispatch = useAppDispatch();
  const { materiais: materiaisSelecionados, tipoCamada } = useAppSelector(state => state.carrinho);
  const user = useAppSelector((state) => state.auth.user);

  const [projetos, setProjetos] = useState<ProjetoDTO[]>([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState<number | ''>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [resultadoCalculo, setResultadoCalculo] = useState<CalculoTermicoResponseDTO | null>(null);
  const [dialogCalculoOpen, setDialogCalculoOpen] = useState(false);

  useEffect(() => {
    if (open && materiaisSelecionados.length > 0) {
      carregarProjetos();
    }
  }, [open, materiaisSelecionados]);

  const carregarProjetos = async () => {
    try {
      const userId = user?.userId;

      const projetosData = await projetoService.getProjetosByUsuario(userId!);
      setProjetos(projetosData);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const handleAdicionarAoProjeto = async () => {
    if (materiaisSelecionados.length === 0) {
      setSnackbarMessage('Selecione pelo menos um material para adicionar ao projeto.');
      setSnackbarOpen(true);
      return;
    }

    if (!projetoSelecionado || projetoSelecionado === '') {
      setSnackbarMessage('Selecione um projeto para adicionar os materiais.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const request = {
        tipoCamada,
        materiais: materiaisSelecionados.map(m => ({
          idMaterialMock: m.id,
          espessura: m.espessura / 100, // Converte centímetros para metros
          ordem: m.ordem
        }))
      };

      await materialProjetoService.adicionarMaterialDoCatalogo(Number(projetoSelecionado), request);

      setSnackbarMessage('Materiais adicionados ao projeto com sucesso!');
      setSnackbarOpen(true);
      setProjetoSelecionado('');
      dispatch(limparCarrinho());
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar materiais ao projeto:', error);
      setSnackbarMessage('Erro ao adicionar materiais ao projeto. Tente novamente.');
      setSnackbarOpen(true);
    }
  };

  const handleAlterarEspessura = (materialId: number, novaEspessura: number) => {
    dispatch(atualizarEspessura({ id: materialId, espessura: novaEspessura }));
  };

  const handleRemoverMaterial = (materialId: number) => {
    dispatch(removerMaterial(materialId));
  };

  const handleLimparCarrinho = () => {
    dispatch(limparCarrinho());
    setSnackbarMessage('Carrinho limpo com sucesso!');
    setSnackbarOpen(true);
  };

  const handleCalcularPropriedades = async () => {
    if (materiaisSelecionados.length === 0) {
      setSnackbarMessage('Adicione materiais ao carrinho antes de calcular.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const request = {
        tipoCamada,
        materiais: materiaisSelecionados.map(m => ({
          idMaterialMock: m.id,
          espessura: m.espessura / 100, // Converte centímetros para metros
          ordem: m.ordem
        }))
      };

      const resultado = await calculoTermicoService.calcularPropriedadesTermicas(request);
      setResultadoCalculo(resultado);
      setDialogCalculoOpen(true);
    } catch (error) {
      console.error('Erro ao calcular propriedades térmicas:', error);
      setSnackbarMessage('Erro ao calcular propriedades térmicas. Tente novamente.');
      setSnackbarOpen(true);
    }
  };

  const handleExportarCalculoPDF = () => {
    if (!resultadoCalculo) return;

    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    // Título Principal
    doc.setFontSize(20);
    doc.setTextColor(46, 125, 50); // Verde
    doc.text('Relatório de Cálculos Térmicos', 105, 20, { align: 'center' });

    // Tipo de Camada
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tipo de Camada: ${tipoCamada}`, 105, 30, { align: 'center' });

    // Data
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data: ${dataAtual}`, 105, 37, { align: 'center' });

    // Linha divisória
    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // Propriedades Térmicas Calculadas
    doc.setFontSize(14);
    doc.setTextColor(46, 125, 50);
    doc.text('Propriedades Térmicas Calculadas', 20, 50);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Transmitância Térmica (U): ${resultadoCalculo.transmitanciaTermica.toFixed(3)} W/(m².K)`, 20, 60);
    doc.text(`Capacidade Térmica (CT): ${resultadoCalculo.capacidadeTermica.toFixed(3)} kJ/(m².K)`, 20, 67);
    doc.text(`Atraso Térmico (φ): ${resultadoCalculo.atrasoTermico.toFixed(2)} horas`, 20, 74);
    doc.text(`Resistência Térmica Total (RT): ${resultadoCalculo.resistenciaTermicaTotal.toFixed(3)} m².K/W`, 20, 81);

    // Tabela de Materiais
    doc.setFontSize(14);
    doc.setTextColor(46, 125, 50);
    doc.text('Materiais Utilizados no Cálculo', 20, 92);

    autoTable(doc, {
      startY: 97,
      head: [['#', 'Material', 'Espessura\n(cm)', 'Densidade\n(kg/m³)', 'Calor Específico\n(kJ/kg.K)', 'Condutividade\n(W/m.K)']],
      body: resultadoCalculo.materiaisDetalhados.map((m, idx) => [
        idx + 1,
        m.nomeMaterial,
        (m.espessura * 100).toFixed(1),
        m.densidade.toFixed(2),
        m.calorEspecifico.toFixed(3),
        m.condutividadeTermica.toFixed(3)
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
        0: { cellWidth: 10 },
        1: { cellWidth: 60, halign: 'left' },
        2: { cellWidth: 25 },
        3: { cellWidth: 28 },
        4: { cellWidth: 30 },
        5: { cellWidth: 27 }
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
        'BioEdifica - Sistema de Cálculos Térmicos',
        105,
        292,
        { align: 'center' }
      );
    }

    // Salvar PDF
    const nomeArquivo = `relatorio-calculos-termicos-${tipoCamada.toLowerCase()}-${dataAtual.replace(/\//g, '-')}.pdf`;
    doc.save(nomeArquivo);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 420 },
            boxSizing: 'border-box',
            padding: '24px',
            background: '#f5f7fa',
          },
        }}
      >
        {/* Header do Carrinho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#388e3c', fontWeight: 700 }}>
            Configuração de Materiais
          </Typography>
          <IconButton onClick={onClose} color="primary">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Lista de Materiais no Carrinho */}
        <Box sx={{ flex: 1, overflow: 'auto', mb: 2 }}>
          {materiaisSelecionados.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <SettingsIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Nenhum material selecionado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Adicione materiais à configuração para incluí-los no projeto
              </Typography>
            </Box>
          ) : (
            materiaisSelecionados.map((material) => (
              <Card key={material.id} sx={{ mb: 2, position: 'relative' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                  <CardMedia
                    component="img"
                    sx={{ width: 120, objectFit: 'cover' }}
                    image={material.dataSourceUrl}
                    alt={material.materialName}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <CardContent sx={{ flex: '1 0 auto', pr: 6, pb: 1 }}>
                      <Typography component="div" variant="subtitle1" fontWeight={600} noWrap>
                        {material.materialName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {material.materialType}
                      </Typography>
                      <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
                        Densidade: {material.density} kg/m³
                      </Typography>
                      <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
                        Ordem: {material.ordem}
                      </Typography>
                    </CardContent>
                    <IconButton
                      aria-label="remover"
                      onClick={() => handleRemoverMaterial(material.id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'error.main',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                {/* Campo de Espessura */}
                <Box sx={{ px: 2, pb: 2 }}>
                  <TextField
                    label="Espessura (centímetros)"
                    type="number"
                    size="small"
                    fullWidth
                    value={material.espessura}
                    onChange={(e) => handleAlterarEspessura(material.id, Number(e.target.value))}
                    inputProps={{ min: 0.1, step: 0.1 }}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Card>
            ))
          )}
        </Box>

        {/* Footer - Seleção de Projeto, Total e Botão */}
        <Box sx={{ borderTop: '1px solid #e0e0e0', pt: 2 }}>
          {/* Seleção de Tipo de Camada */}
          {materiaisSelecionados.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="select-tipo-camada-label">Tipo de Camada</InputLabel>
              <Select
                labelId="select-tipo-camada-label"
                id="select-tipo-camada"
                value={tipoCamada}
                label="Tipo de Camada"
                onChange={(e) => dispatch(setTipoCamada(e.target.value))}
              >
                <MenuItem value="PAREDE">Parede</MenuItem>
                <MenuItem value="COBERTURA">Cobertura</MenuItem>
                <MenuItem value="PISO">Piso</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Seleção de Projeto - só aparece se tiver materiais */}
          {materiaisSelecionados.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="select-projeto-label">Selecione o Projeto</InputLabel>
              <Select
                labelId="select-projeto-label"
                id="select-projeto"
                value={projetoSelecionado}
                label="Selecione o Projeto"
                onChange={(e) => setProjetoSelecionado(e.target.value as number | '')}
              >
                <MenuItem value="">
                  <em>Nenhum projeto selecionado</em>
                </MenuItem>
                {projetos.map((projeto) => (
                  <MenuItem key={projeto.id} value={projeto.id}>
                    {projeto.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="success.main" fontWeight={700}>
              {materiaisSelecionados.length} {materiaisSelecionados.length === 1 ? 'material' : 'materiais'}
            </Typography>
          </Box>

          {/* Botão Limpar Carrinho */}
          {materiaisSelecionados.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              size="large"
              startIcon={<DeleteIcon />}
              onClick={handleLimparCarrinho}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                mb: 2
              }}
            >
              Limpar Todos os Materiais
            </Button>
          )}

          {/* Botão Fazer Cálculos */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            startIcon={<CalculateIcon />}
            onClick={handleCalcularPropriedades}
            disabled={materiaisSelecionados.length === 0}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem',
              mb: 2
            }}
          >
            Fazer Cálculos Térmicos
          </Button>

          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            startIcon={<AddIcon />}
            onClick={handleAdicionarAoProjeto}
            disabled={materiaisSelecionados.length === 0}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Adicionar ao Projeto
          </Button>
        </Box>
      </Drawer>

      {/* Dialog com Resultado dos Cálculos */}
      <Dialog
        open={dialogCalculoOpen}
        onClose={() => setDialogCalculoOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalculateIcon />
            Resultados dos Cálculos Térmicos
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {resultadoCalculo && (
            <Box>
              <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#e8f5e9' }}>
                <Typography variant="h6" color="success.main" gutterBottom>
                  Propriedades Térmicas Calculadas
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Transmitância Térmica (U)
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="success.dark">
                      {resultadoCalculo.transmitanciaTermica.toFixed(3)} W/(m².K)
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Capacidade Térmica (CT)
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="success.dark">
                      {resultadoCalculo.capacidadeTermica.toFixed(3)} kJ/(m².K)
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Atraso Térmico (φ)
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="success.dark">
                      {resultadoCalculo.atrasoTermico.toFixed(2)} horas
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Resistência Térmica Total (RT)
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="success.dark">
                      {resultadoCalculo.resistenciaTermicaTotal.toFixed(3)} m².K/W
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Typography variant="h6" gutterBottom>
                Materiais Utilizados no Cálculo
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {resultadoCalculo.materiaisDetalhados.map((material, index) => (
                  <Paper key={index} elevation={1} sx={{ p: 2, mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {index + 1}. {material.nomeMaterial}
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: 0.5 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Espessura: {(material.espessura * 100).toFixed(1)} cm
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Densidade: {material.densidade} kg/m³
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Calor Específico: {material.calorEspecifico} kJ/(kg.K)
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Condutividade: {material.condutividadeTermica} W/(m.K)
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5', gap: 2 }}>
          <Button onClick={() => setDialogCalculoOpen(false)} color="primary" size="large" sx={{ px: 4 }}>
            Fechar
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportarCalculoPDF}
            size="large"
            sx={{ px: 4 }}
          >
            Exportar PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens de validação */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

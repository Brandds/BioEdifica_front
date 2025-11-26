import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Alert, Box, Button, Drawer, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface CadastrarMaterialDrawerProps {
  open: boolean;
  onClose: () => void;
  onMaterialCadastrado: () => void;
}

export default function CadastrarMaterialDrawer({
  open,
  onClose,
  onMaterialCadastrado
}: CadastrarMaterialDrawerProps) {
  const [formData, setFormData] = useState({
    nomeMaterial: '',
    densidade: '',
    calorEspecifico: '',
    condutividadeTermica: '',
    espessura: '',
    tipoAplicacao: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validação básica
    if (!formData.nomeMaterial || !formData.densidade) {
      setSnackbarMessage('Preencha pelo menos o nome e a densidade do material');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      // Aqui você implementará a chamada à API para cadastrar o material
      console.log('Dados do material a cadastrar:', formData);

      // Simular sucesso
      setSnackbarMessage('Material cadastrado com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Limpar formulário
      setFormData({
        nomeMaterial: '',
        densidade: '',
        calorEspecifico: '',
        condutividadeTermica: '',
        espessura: '',
        tipoAplicacao: ''
      });

      // Callback para atualizar lista
      setTimeout(() => {
        onMaterialCadastrado();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Erro ao cadastrar material:', error);
      setSnackbarMessage('Erro ao cadastrar material. Tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 500 },
            boxSizing: 'border-box',
            padding: '24px',
            background: '#f5f7fa',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700 }}>
            Cadastrar Novo Material
          </Typography>
          <IconButton onClick={onClose} color="primary">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Formulário */}
        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, overflow: 'auto' }}>
          <TextField
            fullWidth
            required
            label="Nome do Material"
            value={formData.nomeMaterial}
            onChange={handleChange('nomeMaterial')}
            margin="normal"
            variant="outlined"
            helperText="Ex: Bloco Cerâmico, Concreto Armado"
          />

          <TextField
            fullWidth
            required
            label="Densidade (kg/m³)"
            type="number"
            value={formData.densidade}
            onChange={handleChange('densidade')}
            margin="normal"
            variant="outlined"
            helperText="Densidade do material em kg/m³"
            inputProps={{ step: '0.01', min: '0' }}
          />

          <TextField
            fullWidth
            label="Calor Específico (kJ/(kg.K))"
            type="number"
            value={formData.calorEspecifico}
            onChange={handleChange('calorEspecifico')}
            margin="normal"
            variant="outlined"
            helperText="Calor específico em kJ/(kg.K)"
            inputProps={{ step: '0.01', min: '0' }}
          />

          <TextField
            fullWidth
            label="Condutividade Térmica (W/(m.K))"
            type="number"
            value={formData.condutividadeTermica}
            onChange={handleChange('condutividadeTermica')}
            margin="normal"
            variant="outlined"
            helperText="Condutividade térmica em W/(m.K)"
            inputProps={{ step: '0.01', min: '0' }}
          />

          <TextField
            fullWidth
            label="Espessura (metros)"
            type="number"
            value={formData.espessura}
            onChange={handleChange('espessura')}
            margin="normal"
            variant="outlined"
            helperText="Espessura do material em metros"
            inputProps={{ step: '0.001', min: '0' }}
          />

          <TextField
            fullWidth
            label="Tipo de Aplicação"
            value={formData.tipoAplicacao}
            onChange={handleChange('tipoAplicacao')}
            margin="normal"
            variant="outlined"
            helperText="Ex: PAREDE, COBERTURA, PISO"
          />

          {/* Botões de Ação */}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              size="large"
              onClick={onClose}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<SaveIcon />}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Cadastrar
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

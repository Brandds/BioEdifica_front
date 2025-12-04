import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { MaterialVisualizacaoDTO } from '../../types/material/materialType';

interface MaterialComEspessura extends MaterialVisualizacaoDTO {
  espessura: number;
  ordem: number;
}

interface CarrinhoState {
  materiais: MaterialComEspessura[];
  tipoCamada: string;
}

const initialState: CarrinhoState = {
  materiais: [],
  tipoCamada: 'PAREDE'
};

const carrinhoSlice = createSlice({
  name: 'carrinho',
  initialState,
  reducers: {
    adicionarMaterial: (state, action: PayloadAction<MaterialVisualizacaoDTO>) => {
      const jaExiste = state.materiais.some(m => m.id === action.payload.id);
      
      if (!jaExiste) {
        const novoMaterial: MaterialComEspessura = {
          ...action.payload,
          espessura: 10, // Valor padrão: 10 cm
          ordem: state.materiais.length + 1
        };
        state.materiais.push(novoMaterial);
      }
    },
    
    removerMaterial: (state, action: PayloadAction<number>) => {
      state.materiais = state.materiais.filter(m => m.id !== action.payload);
      // Reordena os materiais restantes
      state.materiais.forEach((material, index) => {
        material.ordem = index + 1;
      });
    },
    
    atualizarEspessura: (state, action: PayloadAction<{ id: number; espessura: number }>) => {
      const material = state.materiais.find(m => m.id === action.payload.id);
      if (material) {
        material.espessura = action.payload.espessura;
      }
    },
    
    setTipoCamada: (state, action: PayloadAction<string>) => {
      state.tipoCamada = action.payload;
    },
    
    limparCarrinho: (state) => {
      state.materiais = [];
      state.tipoCamada = 'PAREDE';
    }
  }
});

export const {
  adicionarMaterial,
  removerMaterial,
  atualizarEspessura,
  setTipoCamada,
  limparCarrinho
} = carrinhoSlice.actions;

export default carrinhoSlice.reducer;

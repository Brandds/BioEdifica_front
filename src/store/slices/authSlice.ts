import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import URL_ENDPOINTS from '../../constants/URL_ENDPOINTS';
import type { CadastroForm } from '../../pages/Cadastro';
import { usuarioService } from '../../service/usuarioService';
import type { AuthState, LoginCredentials, LoginResponse } from '../../types/usuario/auth';
import type { User } from '../../types/usuario/user';
import { storage } from '../../utils/storage';

const initialState: AuthState = {
  user: storage.getUser(),
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: { message: string; status?: number } }
>(
  'auth/login',
  async (credentials : LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL_ENDPOINTS.LOGIN}?username=${credentials.email}&senha=${credentials.password}`, {});
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      let message = 'Erro ao fazer login';
      
      if (status === 401) {
        message = 'Credenciais inválidas. Verifique seu email e senha.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      return rejectWithValue({
        message,
        status
      });
    }
  }
);

export const registerUser = createAsyncThunk<
  LoginResponse,
  CadastroForm,
  { rejectValue: { message: string; status?: number } }
>(
  'auth/register',
  async (userData: CadastroForm, { rejectWithValue }) => {
    try {
      const response = await usuarioService.criarUsuario(userData);
      return response;
    } catch (error: any) {
      const status = error.response?.status;
      let message = 'Erro ao registrar usuário';
      
      if (status === 409) {
        message = 'Este email já está cadastrado. Tente fazer login.';
      }
      
      return rejectWithValue({ message, status });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Logout síncrono
    logout: (state : AuthState) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.clearAuth();
    },
    
    clearError: (state : AuthState) => {
      state.error = null;
    },
    
    updateUser: (state : AuthState, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        storage.setUser(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state : AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state : AuthState, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Salvar no localStorage
        storage.setToken(action.payload.token);
        storage.setUser(action.payload.user);
      })
      .addCase(loginUser.rejected, (state : AuthState, action) => {
        state.isLoading = false;
        state.error = typeof action.payload === 'object' 
          ? action.payload?.message || 'Erro desconhecido'
          : action.payload || 'Erro desconhecido';
      });
    
    // Register
    builder
      .addCase(registerUser.pending, (state : AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state : AuthState, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state : AuthState, action) => {
        state.isLoading = false;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
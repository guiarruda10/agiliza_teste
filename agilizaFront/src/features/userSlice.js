import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// login do usuário via CPF
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ cpf }, thunkAPI) => {
    try {
      const response = await axios.post('/api/fila/status', { cpf })
      const data = Array.isArray(response.data) ? response.data[0] : response.data

      //rejeita se usuário não encontrado
      if (!data || !data.cpf) {
        return thunkAPI.rejectWithValue('Usuário não cadastrado')
      }

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.erro || 'Erro desconhecido')
    }
  }
)

// registro de usuário (CPF e nome)
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ cpf, name }, thunkAPI) => {
    try {
      const response = await axios.post('/api/fila', { cpf, name })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.erro || 'Erro no cadastro')
    }
  }
)

// Slice Redux (gerencia estados do user)
const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,       //status de login
    userInfo: null,          // dados do usuário autenticado
    loading: false,          // carregamento em andamento
    error: null,             // guarda mensagem de erro 
    registerSuccess: false,  // mostra sucesso no registro
  },
  reducers: {
    logout(state) {
      // reset os states se fizer logout
      state.isLoggedIn = false
      state.userInfo = null
      state.error = null
      state.registerSuccess = false
    },
    clearRegisterSuccess(state) {
      // limpa o registerSuccess
      state.registerSuccess = false
    },
  },
  extraReducers: builder => {
    builder
      // login (caso: pedente) ativa loading e limpa erros
      .addCase(loginUser.pending, state => {
        state.loading = true
        state.error = null
      })
      // login (caso: sucesso) guarda dados e ativa login parando o "loading"
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isLoggedIn = true
        state.userInfo = action.payload
      })
      // login (caso: falha) desliga loading e guarda erro
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // registro (caso: pendente) ativa loading e limpa erros e sucessos
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = null
        state.registerSuccess = false
      })
      // registro (caso: sucesso) desliga loading e ativa sucesso
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.registerSuccess = true
      })
      // registro (caso: falha) desliga loading e guada o erro, limpa sucesso
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.registerSuccess = false
      })
  },
})

export const { logout, clearRegisterSuccess } = userSlice.actions
export default userSlice.reducer
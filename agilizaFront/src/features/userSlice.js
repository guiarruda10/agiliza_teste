import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// login do usuário via CPF
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ cpf }, thunkAPI) => {
    try {
      const response = await axios.post(`https://agiliza-api-oez3.onrender.com/api/fila/status`, { cpf })
      const data = Array.isArray(response.data) ? response.data[0] : response.data

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
      const response = await axios.post(`https://agiliza-api-oez3.onrender.com/api/fila/attend`, { cpf, name })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.erro || 'Erro no cadastro')
    }
  }
)

// Slice Redux (sem alterações necessárias)
const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    userInfo: null,
    loading: false,
    error: null,
    registerSuccess: false,
  },
  reducers: {
    logout(state) {
      state.isLoggedIn = false
      state.userInfo = null
      state.error = null
      state.registerSuccess = false
    },
    clearRegisterSuccess(state) {
      state.registerSuccess = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isLoggedIn = true
        state.userInfo = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = null
        state.registerSuccess = false
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.registerSuccess = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.registerSuccess = false
      })
  },
})

export const { logout, clearRegisterSuccess } = userSlice.actions
export default userSlice.reducer

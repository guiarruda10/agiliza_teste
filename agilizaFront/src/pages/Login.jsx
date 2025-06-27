import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../features/userSlice"
import { useNavigate } from "react-router-dom"

export default function Login() {
  // state para guarda cpf
  const [cpf, setCpf] = useState("")
  //state para armazenar erro de cpf
  const [localError, setLocalError] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // status de login e erro do Redux
  const { isLoggedIn, error } = useSelector(state => state.user)

  // validando que cpf deve ter 11 dig
  const validateCPF = (cpf) => /^\d{11}$/.test(cpf)

  //envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError(null)

    // valida cpf antes de enviar para api
    if (!validateCPF(cpf)) {
      setLocalError("CPF deve conter exatamente 11 dígitos numéricos.")
      return
    }

    // dispatch: action de login
    dispatch(loginUser({ cpf }))
  }

  // se login = true manda para history
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/history")
    }
  }, [isLoggedIn, navigate])

  // se user nao tiver na fila manda para register
  useEffect(() => {
    if (error === "Usuário não cadastrado") {
      navigate("/register", { state: { cpf } })
    }
  }, [error, navigate, cpf])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar com CPF</h2>

        {/* campo do cpf*/}
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite seu CPF (somente números)"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          maxLength={11}
        />

        {/* Botão de submit do form*/}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Acessar Histórico
        </button>

        {/* erro de validação */}
        {localError && (
          <p className="text-red-600 mt-4 text-center">{localError}</p>
        )}

        {/* erro que vem da api */}
        {error && error !== "Usuário não cadastrado" && (
          <p className="text-red-600 mt-4 text-center">{error}</p>
        )}
      </form>
    </div>
  )
}

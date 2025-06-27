export default function LoginForm({ cpf, setCpf, onSubmit, loading, error }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="CPF (sem pontos e traços)"
        value={cpf}
        onChange={e => setCpf(e.target.value)}
        required
        maxLength={11}
        minLength={11}
        pattern="\d{11}"
        title="Digite um CPF válido com 11 números"
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-300 text-white p-2 rounded-md disabled:opacity-50 hover:bg-gray-500 transition"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>


      {typeof error === 'string' && error !== 'Usuário não cadastrado' && (
        <p className="text-red-600 text-center">{error}</p>
      )}
    </form>
  )
}

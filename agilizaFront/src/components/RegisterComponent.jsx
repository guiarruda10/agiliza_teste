export default function RegisterForm({ cpf, setCpf, name, setName, loading, error, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Nome completo"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="CPF (11 números sem pontos e traços)"
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
        {loading ? 'Cadastrando...' : 'Nova consulta'}
      </button>

      {error && (
        <p className="text-red-600 text-center">
          {typeof error === 'string' ? error : 'Erro no cadastro'}
        </p>
      )}
    </form>
  )
}

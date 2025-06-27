export default function HistoryCard({ consulta, onAttend, attending }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full sm:w-96 md:w-80 lg:w-72 flex flex-col">
      <p className="font-semibold text-xl mb-3">{consulta.name}</p>
      <p className="text-sm text-gray-700 mb-2">CPF: {consulta.unitaryRegistration || consulta.cpf}</p>
      <p className="mb-2">
        Data da consulta: <span className="font-medium">{consulta.dataConsulta || 'N/A'}</span>
      </p>
      <p className="mb-2">
        Posição na fila: <span className="font-medium">{consulta.posicao}</span>
      </p>
      <p className="mb-2">
        Tempo estimado: <span className="font-medium">{consulta.estimatedTime} minutos</span>
      </p>
      <p className="mb-2">
        Horário estimado: <span className="font-medium">{consulta.horaAtendimento || 'N/A'}</span>
      </p>
      <p>
        Status:
        <span
          className={`ml-1 font-semibold ${consulta.attended ? 'text-green-700' : 'text-yellow-700'
            }`}
        >
          {consulta.attended ? 'Atendido' : 'Aguardando atendimento'}
        </span>
      </p>

      {/* botao marcar como atendido */}
      {!consulta.attended && onAttend && (
        <button
          onClick={() => onAttend(consulta.unitaryRegistration || consulta.cpf, consulta.name)}
          disabled={attending}
          className={`mt-4 px-4 py-2 rounded text-white ${attending ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {attending ? 'Marcando...' : 'Marcar como atendido'}
        </button>
      )}
    </div>
  )
}

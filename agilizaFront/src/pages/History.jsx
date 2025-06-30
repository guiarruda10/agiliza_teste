import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HistoryCard from "../components/HistoryComponent";

export default function History() {
  // dados do usuário logado do Redux
  const { userInfo } = useSelector(state => state.user);

  // states
  const [statusData, setStatusData] = useState([]); // armazena histórico retornado da API
  const [loading, setLoading] = useState(false);    // controle de carregamentos
  const [error, setError] = useState(null);         // armazena erros, caso ocorra
  const [attendingId, setAttendingId] = useState(null); // armazena CPF sendo atendido para controle de loading em botoes

  const navigate = useNavigate();

  //busca histórico do usuário
  const fetchStatus = async () => {
    if (!userInfo?.cpf) { // valida existencia do CPF
      setError("CPF do usuário não encontrado.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // obter status da fila
      const response = await axios.post("https://agiliza-api-oez3.onrender.com/api/fila/status", { cpf: userInfo.cpf })
      // resposta em array para facilitar map no retorno
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setStatusData(data);
    } catch (err) {
      setError(err.response?.data?.erro || "Erro ao buscar histórico.");
    } finally {
      setLoading(false);
    }
  };

  // executa fetch ao carregar ou quando userInfo muda (novo login)
  useEffect(() => {
    fetchStatus();
  }, [userInfo]);

  //marcar consulta como atendida
  const handleMarkAsAttended = async (cpf, name) => {
    setAttendingId(cpf); // Define ID para controle de loading por item
    try {
      // marcar atendimento
      const res = await axios.patch("https://agiliza-api-oez3.onrender.com/api/fila/attend", { cpf, name });
      if (res.status === 200) {
        await fetchStatus(); // atualiza histórico após atendimento
        navigate("/register"); //usuário para registro após atendimento
        alert("Obrigado por comparecer, sinta-se avontade para marcar uma nova consulta")
      }
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao marcar como atendido.");
    } finally {
      setAttendingId(null); // reseta controle de loading
    }
  };

  // condicional enquanto carrega
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Carregando histórico...</p>
      </div>
    );
  }

  // condicional em caso de erro
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  // caso não existam dados de histórico
  if (!statusData.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Nenhum histórico encontrado.</p>
      </div>
    );
  }

  //cards do histórico
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Histórico de Consultas</h2>

      <div className="flex flex-wrap gap-8 justify-center">
        {statusData.map((consulta, idx) => (
          <HistoryCard
            key={idx}
            consulta={consulta}
            onAttend={handleMarkAsAttended} //manda função de atendimento para o card
            attending={attendingId === (consulta.unitaryRegistration || consulta.cpf)} // ativa loading no card específico
          />
        ))}
      </div>
    </div>
  );
}

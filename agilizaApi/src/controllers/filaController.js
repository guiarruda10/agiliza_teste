const Fila = require("../models/Fila");

const INTERVAL_MINUTES = 30; // tempo entre atendimentos

// valida cpf
const isValidCPFFormat = (cpf) => /^\d{11}$/.test(cpf);

// formato de brasilia
function nowInGMT3() {
  const nowUTC = new Date();
  return new Date(nowUTC.getTime() - 3 * 60 * 60000); // converte 3h em ms
}

// cadastra paciente na fila
exports.entry = async (req, res) => {
  const { name, cpf } = req.body;

  // campos preenchidos
  if (!(name && cpf)) {
    return res.status(400).json({ erro: "Preencha: Nome e CPF." });
  }

  // formato do cpf correto
  if (!isValidCPFFormat(cpf)) {
    return res.status(400).json({ erro: "CPF inválido." });
  }

  const agora = nowInGMT3();

  const startOfDay = new Date(agora);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(agora);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // paciente ja este na fila hoje
    const jaNaFilaHoje = await Fila.findOne({
      cpf,
      timeEntry: { $gte: startOfDay, $lte: endOfDay }
    });

    if (jaNaFilaHoje) {
      return res.status(409).json({ erro: "Paciente já está na fila hoje." });
    }

    // ultimo paciente agendado hoje para calcular horario disponivel
    const ultimoPaciente = await Fila.findOne({
      timeEntry: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ timeEntry: -1 });

    let novoHorario;
    if (ultimoPaciente) {
      // proximo horario baseado no ultimo agendado + intervalo
      novoHorario = new Date(ultimoPaciente.timeEntry.getTime() + INTERVAL_MINUTES * 60000);

      // Se proximo horario calculado estiver no passado arredonda para o proximo intervalo disponivel
      if (novoHorario < agora) {
        const minutos = agora.getMinutes();
        const resto = minutos % INTERVAL_MINUTES;
        const minutosArredondados = resto === 0 ? minutos : minutos + (INTERVAL_MINUTES - resto);

        novoHorario = new Date(agora);
        novoHorario.setMinutes(minutosArredondados, 0, 0);

        if (novoHorario < agora) {
          novoHorario = new Date(novoHorario.getTime() + INTERVAL_MINUTES * 60000);
        }
      }
    } else {
      // se nao tiver pacientes marca horário como agora
      novoHorario = new Date(agora);
    }

    // cria e retorna paciente
    const novoPaciente = await Fila.create({
      name,
      cpf,
      timeEntry: novoHorario,
      attended: false
    });

    return res.status(201).json(novoPaciente);

  } catch (error) {
    console.error("Erro interno ao processar requisição:", error);
    return res.status(500).json({ erro: "Erro interno ao processar requisição." });
  }
};

// exibe o historico 
exports.status = async (req, res) => {
  const { cpf } = req.body;

  try {
    // pega pacientes ordenados por horário de agendamento
    const waitingLine = await Fila.find().sort({ timeEntry: 1 });

    // encontra o indice do paciente na fila
    const index = waitingLine.findIndex(p => p.cpf === cpf);
    if (index < 0) {
      return res.status(404).json({ erro: "Usuário não cadastrado" });
    }

    const paciente = waitingLine[index];

    //tempo estimado de atendimento
    const estimatedTime = (index + 1) * INTERVAL_MINUTES;

    // hora de atendimento(horario atual + tempo estimado)
    const atendimentoTimestamp = new Date();
    atendimentoTimestamp.setMinutes(atendimentoTimestamp.getMinutes() + estimatedTime);

    const horaAtendimento = atendimentoTimestamp.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    // ajusta para o hr de brasilia ao exibir o dado da consulta
    const dataConsulta = new Date(
      paciente.timeEntry.getTime() - 3 * 60 * 60 * 1000
    ).toLocaleDateString('pt-BR');

    return res.json({
      name: paciente.name,
      cpf: paciente.cpf,
      posicao: index + 1,
      estimatedTime,
      horaAtendimento,
      attended: paciente.attended,
      dataConsulta
    });

  } catch (error) {
    console.error("Erro ao consultar status:", error);
    return res.status(500).json({ erro: "Erro interno ao consultar status." });
  }
};

// marca paciente como atendido e atualiza fila
exports.markAsAttended = async (req, res) => {
  let { cpf, name } = req.body;

  // cpf enviado
  if (!cpf || !name) {
    return res.status(400).json({ erro: "Informe CPF e nome do paciente." });
  }

  cpf = cpf.trim();
  name = name.trim();

  try {
    // tira paciente da fila
    const pacienteRemovido = await Fila.findOneAndDelete({ cpf, name });

    if (!pacienteRemovido) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }

    // busca pacientes que ficaram na fila
    const pacientesRestantes = await Fila.find({ attended: false }).sort({ timeEntry: 1 });

    // recalcula o horario dos atendimentos
    const updates = pacientesRestantes.map(async (paciente) => {
      paciente.timeEntry = new Date(paciente.timeEntry.getTime() - INTERVAL_MINUTES * 60000);
      return paciente.save();
    });

    await Promise.all(updates);

    return res.json({ mensagem: "Paciente atendido e fila atualizada." });
  } catch (error) {
    console.error("Erro ao marcar paciente como atendido e atualizar fila:", error);
    return res.status(500).json({ erro: "Erro interno ao processar atendimento." });
  }
};

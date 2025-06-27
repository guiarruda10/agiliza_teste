---

# Agiliza 

---

## 1. Visão Geral

Agiliza é um sistema web completo para gerenciamento digital de filas em ambientes de saúde, exemplos como clínicas odontológicas e postos de saúde.
Permite o cadastro e controle de pacientes na fila, acompanhamento do status com previsão de atendimento e registro histórico, visando otimizar o fluxo de atendimento e reduzir aglomerações físicas.

---

## 2. Tecnologias Utilizadas

### Backend

* **Node.js + Express**: Servidor HTTP e gerenciamento das rotas da API.
* **MongoDB (via Mongoose)**: Banco de dados NoSQL para armazenar pacientes e status da fila.
* **JavaScript (ES6+)**: Lógica e estrutura do backend.


### Frontend

* **React.js**: Framework para construção da interface.
* **React Router DOM**: Navegação entre telas.
* **Redux Toolkit**: Gerenciamento global de estado (autenticação, registro, erros).
* **Axios**: Comunicação HTTP com o backend.
* **Tailwind CSS**: Estilização moderna e responsiva.

---

## 3. Estrutura do Projeto

### Backend (API)

* **Controllers (filaController.js)**

  * `entry`: Registra paciente na fila respeitando validação de CPF e horários baseados no último agendamento.
  * `status`: Consulta o status do paciente na fila, posição e previsão de atendimento.
  * `markAsAttended`: Marca paciente como atendido, remove da fila e atualiza horários dos pacientes restantes.

* **Rotas (filaRoutes.js)**

  * `POST /fila`: Cadastrar paciente na fila.
  * `POST /fila/status`: Obter posição na fila.
  * `PATCH /fila/attend`: Marcar como atendido.

---

### Frontend

* **Páginas principais**

  * `Login`: Autenticação pelo CPF.
  * `Register`: Cadastro do paciente com CPF e nome.
  * `History`: Visualização do histórico do paciente na fila.

* **Componentes**

  * `RegisterForm`: Formulário reutilizável para cadastro.
  * `HistoryCard`: Exibe consulta individual e botão para marcar atendimento.

* **Rotas definidas em `App.jsx`**

  * `/` → Login
  * `/register` → Registro
  * `/history` → Histórico e controle da fila

---

## 4. Funcionamento e Fluxo

### Cadastro e Entrada na Fila

* Usuário registra nome e CPF (11 dígitos).
* Backend verifica se paciente já está na fila no mesmo dia.
* Agenda horário baseado no último agendamento + intervalo fixo de 30 minutos.
* Resposta inclui o horário agendado e dados do paciente.

### Consulta de Status

* Usuário consulta pelo CPF para obter:

  * Posição na fila,
  * Tempo estimado até atendimento,
  * Hora prevista para atendimento,
  * Status de atendimento (atendido ou não).

### Atendimento e Atualização da Fila

* Operador ou paciente pode marcar atendimento concluído.
* Backend remove paciente da fila e recalcula os horários dos demais para manter os intervalos corretos.
* Histórico atualizado e usuário redirecionado para cadastro, se desejar nova consulta.

---

## 5. Detalhes Técnicos Relevantes

### Backend

* Controle de intervalo de 30 minutos entre atendimentos.
* Tratamento de erros com respostas claras e códigos HTTP apropriados (400, 404, 409, 500).
* Lógica para evitar agendamentos duplicados no mesmo dia para o mesmo CPF.

### Frontend

* Validação de CPF no frontend antes de enviar requisição.
* Uso de `useEffect` para controle de navegação após login e registro.
* Controle visual de loading e mensagens de erro.
* Atualização dinâmica da fila após cada atendimento.

---

## 6. Instruções para Execução

### Backend

1. Configurar ambiente Node.js com dependências (`express`, `mongoose`, etc).
2. Configurar conexão com banco MongoDB.
3. Rodar servidor (`npm start`).
4. Endpoints disponíveis:

   * `POST /api/fila` para cadastro.
   * `POST /api/fila/status` para consulta.
   * `PATCH /api/fila/attend` para marcação de atendimento.

### Frontend

1. Instalar dependências React (`npm install`).
2. Rodar aplicação (`npm run dev`).
4. Utilizar rotas para navegar entre login, registro e histórico.

---

## 7. Possíveis Melhorias Futuras

* Autenticação com tokens JWT para segurança aprimorada.
* Notificações em tempo real (WebSocket) para atualização automática da fila.
* Suporte a múltiplas unidades (clínicas, salas).
* Integração com sistemas de SMS ou email para avisos aos pacientes.
* Suporte a intervalos dinâmicos e priorização de pacientes.

---

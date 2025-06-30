import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearRegisterSuccess } from '../features/userSlice';
import RegisterForm from '../components/RegisterComponent';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // manda o cpf para tela de login preenchido
  const prefilledCpf = location.state?.cpf || '';
  const { loading, error, registerSuccess } = useSelector(state => state.user);

  // state para cpf nome e noti de cadastro
  const [cpf, setCpf] = useState(prefilledCpf);
  const [name, setName] = useState('');
  const [notification, setNotification] = useState('');

  //sucesso no cadastro: exibe notificação, limpa flag de sucesso no Redux, redireciona para login após 3 segundos
  useEffect(() => {
    if (registerSuccess) {
      setNotification('Usuário cadastrado com sucesso! Redirecionando para o login ...');

      const timer = setTimeout(() => {
        setNotification('');
        dispatch(clearRegisterSuccess());
        navigate('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [registerSuccess, dispatch, navigate]);

  // renderiza envio do formulário
  const handleSubmit = e => {
    e.preventDefault();

    // validacao do CPF
    if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) {
      alert('CPF inválido. Deve conter 11 números sem pontos ou traços.');
      return;
    }
    // validaçao do nome 
    if (!name.trim()) {
      alert('Preencha o nome completo.');
      return;
    }

    // dispatch cadastro
    dispatch(registerUser({ cpf, name }));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-300 overflow-hidden">
      <h1 className="absolute top-16 text-[100px] font-extrabold text-blue opacity-10 select-none pointer-events-none">
        AGILIZA
      </h1>

      <div className="z-10 max-w-sm w-full p-12 bg-white rounded-lg shadow-md">
        {/*sucesso no cadastro */}
        {notification && (
          <div className="mb-4 p-3 bg-green-500 text-white rounded-md text-center font-semibold">
            {notification}
          </div>
        )}
        
        <RegisterForm
          cpf={cpf}
          setCpf={setCpf}
          name={name}
          setName={setName}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

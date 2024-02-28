import React, { useContext } from "react";
import { useHistory } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import '../CSS/FormularioLogin.css'; // importar o arquivo CSS

const FormularioLogin = () => {
  const history = useHistory();
  const { signIn } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const [error, setError] = React.useState(null);

  const handleLogin = async (data) => {
    try {
      await signIn(data);
      history.push('/WelcomePage'); // Redirecionar para a página inicial após o login
    } catch (error) {
      setError("Falha ao entrar. Verifique seu usuário e senha.");
    }
  };

  return (
    <div className="login-container">
      {error && <div className="login-alert">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            {...register('username')}
            id="username"
            type="text"
            autoComplete="username"
            required
            placeholder="Digite seu nome de usuário"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            {...register('password')}
            id="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Digite sua senha"
          />
        </div>
        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
};

export default FormularioLogin;

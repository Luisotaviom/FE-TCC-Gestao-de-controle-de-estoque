import { useHistory } from 'react-router-dom'; // Assuming you're using react-router
import { AuthContext } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import React, { useContext } from "react";

const FormularioLogin = () => {
  const history = useHistory(); // For redirection after login
  const { signIn } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();
  const [error, setError] = React.useState(null);

  const handleLogin = async (data) => {
    try {
      await signIn(data);
    } catch (error) {
      // Definir estado de erro para mostrar na UI
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div>
        <label htmlFor="username">Nome de Usuário:</label>
        <input
            {...register('username')}
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className=""
            placeholder="username"
          />
      </div>
      <div>
        <label htmlFor="password">Senha:</label>
        <input
            {...register('password')}
            id="password"
            name="password"
            type="password"
            autoComplete="password"
            required
            className=""
            placeholder="password"
          />
      </div>
      <button type="submit">Entrar</button>
    </form>
  );
};

export default FormularioLogin;

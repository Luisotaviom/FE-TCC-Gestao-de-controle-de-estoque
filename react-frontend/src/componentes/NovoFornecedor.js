import React, { useState } from "react";
import FornecedorDataService from "../services/GerencyService2";
import styles from "../CSS/NovoFornecedor.module.css"; // Importe o arquivo CSS como módulo

const NovoFornecedor = (props) => {
  const initialFornecedorState = {
    id: null,
    nome: "",
    cidade: "",
    celular: "",
    email: "",
    ativo: true,
  };

  const [fornecedor, setFornecedor] = useState(initialFornecedorState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFornecedor({ ...fornecedor, [name]: value });
  };

  const saveFornecedor = () => {
    // Verifica se todos os campos estão preenchidos
    if (
      !fornecedor.nome ||
      !fornecedor.cidade ||
      !fornecedor.celular ||
      !fornecedor.email
    ) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Verifica se o email contém o símbolo "@"
    if (!fornecedor.email.includes("@")) {
      setError("Por favor, insira um endereço de email válido.");
      return;
    }

    const data = {
      nome: fornecedor.nome,
      cidade: fornecedor.cidade,
      celular: fornecedor.celular,
      email: fornecedor.email,
      ativo: fornecedor.ativo,
    };

    FornecedorDataService.create2(data)
      .then((response) => {
        setFornecedor({
          id: response.data.id,
          nome: response.data.nome,
          cidade: response.data.cidade,
          celular: response.data.celular,
          email: response.data.email,
          ativo: response.data.ativo,
        });
        setSubmitted(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newFornecedor = () => {
    setFornecedor(initialFornecedorState);
    setSubmitted(false);
  };

  return (
    <div className={styles["edit-form"]}>
      {submitted ? (
        <div>
          <strong>
            <p className={styles["text-success"]}>Criado com sucesso!</p>
          </strong>
          <button className={`${styles["btn_add"]}`} onClick={newFornecedor}>
            Criar fornecedor
          </button>{" "}
          <button className={`${styles["btn"]}`} onClick={props.history.goBack}>
            Voltar para lista
          </button>
        </div>
      ) : (
        <div>
          {error && <div className={styles["error-message"]}>{error}</div>}
          <div className={styles["form-group"]}>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              className={`form-control ${styles["form-control"]}`}
              id="nome"
              required
              value={fornecedor.nome}
              onChange={handleInputChange}
              name="nome"
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="cidade">Cidade</label>
            <input
              type="text"
              className={`form-control ${styles["form-control"]}`}
              id="cidade"
              required
              value={fornecedor.cidade}
              onChange={handleInputChange}
              name="cidade"
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="celular">Telefone</label>
            <input
              type="text"
              className={`form-control ${styles["form-control"]}`}
              id="celular"
              required
              value={fornecedor.celular}
              onChange={handleInputChange}
              name="celular"
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={`form-control ${styles["form-control"]}`}
              id="email"
              required
              value={fornecedor.email}
              onChange={handleInputChange}
              name="email"
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="ativo">Ativo</label>
            <input
              type="checkbox"
              className={`form-control ${styles["form-control"]}`}
              id="ativo"
              checked={fornecedor.ativo}
              onChange={() =>
                setFornecedor({ ...fornecedor, ativo: !fornecedor.ativo })
              }
            />
          </div>
          <button onClick={saveFornecedor} className={`${styles["btn_add"]}`}>
            Criar fornecedor
          </button>
        </div>
      )}
    </div>
  );
};

export default NovoFornecedor;

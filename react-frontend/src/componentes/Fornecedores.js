import React, { useState, useEffect } from "react";
import FornecedoresDataService from "../services/GerencyService2";
import styles from "../CSS/update.module.css"; // Certifique-se de ter o arquivo CSS correspondente

const Fornecedores = (props) => {
  const initialFornecedoresState = {
    id: null,
    nome: "",
    cidade: "",
    celular: "",
    email: "",
    ativo: true,
  };

  const [currentFornecedores, setCurrentFornecedores] = useState(
    initialFornecedoresState
  );
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getFornecedores = async () => {
      try {
        const response = await FornecedoresDataService.get2(
          props.match.params.id
        );
        setCurrentFornecedores(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    getFornecedores();
  }, [props.match.params.id]);

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    setCurrentFornecedores({
      ...currentFornecedores,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const updateFornecedores = () => {
    FornecedoresDataService.update2(currentFornecedores.id, currentFornecedores)
      .then((response) => {
        console.log(response.data);
        setMessage(
          "Troca de informações sobre o fornecedor feita com sucesso!"
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const voltarParaLista = () => {
    props.history.push("/ListaDeFornecedores");
  };

  return (
    <div className={styles.produtoEditContainer}>
      <div className={styles.produtoInfo} onClick={toggleEdit}>
        <h2>{currentFornecedores.nome}</h2>
        <p>Cidade: {currentFornecedores.cidade}</p>
        <p>Telefone: {currentFornecedores.celular}</p>
        <p>Email: {currentFornecedores.email}</p>
        <p>Ativo: {currentFornecedores.ativo ? "Sim" : "Não"}</p>
      </div>
      {isEditing && (
        <div className={styles.produtoEditForm}>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              className={styles.formControl}
              value={currentFornecedores.nome}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cidade">Cidade:</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              className={styles.formControl}
              value={currentFornecedores.cidade}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="celular">Telefone:</label>
            <input
              type="text"
              id="celular"
              name="celular"
              className={styles.formControl}
              value={currentFornecedores.celular}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.formControl}
              value={currentFornecedores.email}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="ativo">Ativo:</label>
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              className={styles.checkbox}
              checked={currentFornecedores.ativo}
              onChange={handleInputChange}
            />
          </div>
          <button className={styles.btn_put} onClick={updateFornecedores}>
            Atualizar
          </button>
          <button className={styles.btn} onClick={voltarParaLista}>
            Voltar
          </button>
        </div>
      )}
    </div>
  );
};

export default Fornecedores;

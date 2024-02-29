import React, { useState, useEffect } from "react";
import ProdutoDataService from "../services/GerencyService";
import styles from "../CSS/update.module.css"; // Certifique-se de ter o arquivo CSS correspondente

const Produtos = ({ match, history }) => {
  const initialProdutoState = {
    id: null,
    nome: "",
    fornecedor_id: "",
    categoria: "",
    ativo: true,
  };

  const [currentProduto, setCurrentProduto] = useState(initialProdutoState);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getProduto = async () => {
      try {
        const response = await ProdutoDataService.get(match.params.id);
        setCurrentProduto(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    getProduto();
  }, [match.params.id]);

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    setCurrentProduto({
      ...currentProduto,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const updateProduto = () => {
    ProdutoDataService.update(currentProduto.id, currentProduto)
      .then((response) => {
        console.log(response.data);
        setMessage("Troca de informações sobre o Produto feita com sucesso!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const voltarParaLista = () => {
    history.push("/ListadeProdutos");
  };

  return (
    <div className={styles.produtoEditContainer}>
      <div className={styles.produtoInfo} onClick={toggleEdit}>
        <h2>{currentProduto.nome}</h2>
        <p>Categoria: {currentProduto.categoria}</p>
        <p>Ativo: {currentProduto.ativo ? "Sim" : "Não"}</p>
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
              value={currentProduto.nome}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categoria">Categoria:</label>
            <select
              id="categoria"
              name="categoria"
              className={styles.formControl}
              value={currentProduto.categoria}
              onChange={handleInputChange}
            >
              <option value="">Selecione</option>
              <option value="Gás">Gás</option>
              <option value="Água">Água</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ativo">Ativo:</label>
            <input
              type="checkbox"
              id="ativo"
              name="ativo"
              className={styles.checkbox}
              checked={currentProduto.ativo}
              onChange={handleInputChange}
            />
          </div>
          <button className={styles.btn_put} onClick={updateProduto}>
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

export default Produtos;

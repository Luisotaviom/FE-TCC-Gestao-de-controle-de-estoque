import React, { useState } from "react";
import ProdutoDataService from "../services/GerencyService";
import styles from "../CSS/CriarProduto.module.css"; // Certifique-se de ter o arquivo CSS correspondente

const CriarProduto = (props) => {
  const fornecedorId = props.match.params.id;

  if (!fornecedorId) {
    console.error("Fornecedor ID is undefined");
    // Lidar com o caso de ID indefinido, talvez redirecionando de volta ou mostrando uma mensagem
  }

  const initialProdutoState = {
    id: null,
    nome: "",
    fornecedor_id: "",
    categoria: "",
    ativo: true,
  };

  const [produto, setProduto] = useState(initialProdutoState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduto({ ...produto, [name]: value });
  };

  const salvar = () => {
    const data = {
      nome: produto.nome,
      categoria: produto.categoria,
      ativo: produto.ativo,
    };

    ProdutoDataService.create(fornecedorId, data)
      .then((response) => {
        setProduto({
          id: response.data.id,
          nome: response.data.nome,
          fornecedor_id: response.data.fornecedor_id,
          categoria: response.data.categoria,
          ativo: response.data.ativo,
        });

        setSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const novoProduto = () => {
    setProduto(initialProdutoState);
    setSubmitted(false);
  };

  const voltarParaLista = () => {
    props.history.push("/ListadeFornecedores");
  };

  return (
    <div className={styles.editForm}>
      {submitted ? (
        <div>
          <strong>
            <p className={styles.successMessage}>Criado com sucesso!</p>
          </strong>
          <button className={`${styles.btn_add}`} onClick={novoProduto}>
            Novo
          </button>
          <button className={`${styles.btn}`} onClick={voltarParaLista}>
            Voltar para Lista
          </button>
        </div>
      ) : (
        <div>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              className={styles.formControl}
              id="nome"
              required
              value={produto.nome}
              onChange={handleInputChange}
              name="nome"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoria">Categoria</label>
            <select
              className={styles.formControl}
              id="categoria"
              required
              value={produto.categoria}
              onChange={handleInputChange}
              name="categoria"
            >
              <option value="">Selecione</option>
              <option value="Gás">Gás</option>
              <option value="Água">Água</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ativo">Ativo</label>
            <input
              type="checkbox"
              className={styles.checkbox}
              id="ativo"
              checked={produto.ativo}
              onChange={() => setProduto({ ...produto, ativo: !produto.ativo })}
            />
          </div>

          <button onClick={salvar} className={`${styles.btn_add}`}>
            Criar Produto
          </button>
          <button onClick={voltarParaLista} className={`${styles.btn}`}>
            Voltar
          </button>
        </div>
      )}
    </div>
  );
};

export default CriarProduto;

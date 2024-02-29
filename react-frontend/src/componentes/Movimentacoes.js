import React, { useState, useEffect } from "react";
import MovimentacoesDataService from "../services/GerencyServiceMov";
import styles from "../CSS/update.module.css"; // Certifique-se de ter o arquivo CSS correspondente

const Movimentacoes = (props) => {
  const [currentMovimentacao, setCurrentMovimentacao] = useState({
    id: null,
    produto_id: "",
    quantidade: "",
    valor: "",
    tipo: "",
    dataRegistro: "",
    fornecedor_id: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    getMovimentacao(props.match.params.id);
  }, [props.match.params.id]);

  const getMovimentacao = (id) => {
    MovimentacoesDataService.get(id)
      .then((response) => {
        setCurrentMovimentacao(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar a movimentação: ", error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentMovimentacao({ ...currentMovimentacao, [name]: value });
  };

  const updateMovimentacao = () => {
    // Verifique se a dataRegistro tem exatamente 16 caracteres
    if (
      currentMovimentacao.dataRegistro &&
      currentMovimentacao.dataRegistro.length === 16
    ) {
      // Adicione ":00" à data formatada
      currentMovimentacao.dataRegistro += ":00";
    }

    // Agora, faça a solicitação de atualização com a data formatada
    MovimentacoesDataService.update(currentMovimentacao.id, currentMovimentacao)
      .then((response) => {
        setMessage("Informações sobre a Movimentação atualizadas com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar a movimentação: ", error);
        setMessage(
          "Erro ao atualizar a movimentação. Verifique os campos e tente novamente."
        );
      });
  };

  const voltarParaLista = () => {
    props.history.push("/ListaDeMovimentacoes");
  };

  return (
    <div className={styles.produtoEditContainer}>
      {currentMovimentacao ? (
        <div className={styles.produtoEditForm}>
          <h4>Movimentação</h4>
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="produto_id">Produto ID:</label>
              <input
                type="text"
                className={styles.formControl}
                id="produto_id"
                name="produto_id"
                required
                value={currentMovimentacao.produto_id}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="quantidade">Quantidade:</label>
              <input
                type="text"
                className={styles.formControl}
                id="quantidade"
                name="quantidade"
                required
                value={currentMovimentacao.quantidade}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="valor">Valor:</label>
              <input
                type="text"
                className={styles.formControl}
                id="valor"
                name="valor"
                required
                value={currentMovimentacao.valor}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="tipo">Tipo:</label>
              <select
                className={styles.formControl}
                id="tipo"
                name="tipo"
                required
                value={currentMovimentacao.tipo}
                onChange={handleInputChange}
              >
                <option value="">Selecione o Tipo</option>
                <option value="E">E</option>
                <option value="S">S</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="dataRegistro">Data de Registro:</label>
              <input
                type="datetime-local"
                className={styles.formControl}
                id="dataRegistro"
                name="dataRegistro"
                required
                value={currentMovimentacao.dataRegistro}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="fornecedor_id">Fornecedor ID:</label>
              <input
                type="text"
                className={styles.formControl}
                id="fornecedor_id"
                name="fornecedor_id"
                required
                value={currentMovimentacao.fornecedor_id}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="button"
              onClick={updateMovimentacao}
              className={styles.btn_put}
            >
              Atualizar
            </button>{" "}
            <button onClick={voltarParaLista} className={styles.btn}>
              Voltar
            </button>
            {message && (
              <strong>
                <p className="text-success">{message}</p>
              </strong>
            )}
          </form>
        </div>
      ) : (
        <div>
          <br />
          <p>Clique na Movimentação...</p>
        </div>
      )}
    </div>
  );
};

export default Movimentacoes;

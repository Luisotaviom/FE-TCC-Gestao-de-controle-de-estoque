import React, { useState, useEffect } from "react";
import MovimentacoesDataService from "../services/GerencyServiceMov";

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
    if (currentMovimentacao.dataRegistro && currentMovimentacao.dataRegistro.length === 16) {
      // Adicione ":00" à data formatada
      currentMovimentacao.dataRegistro += ':00';
    }
  
    // Agora, faça a solicitação de atualização com a data formatada
    MovimentacoesDataService.update(currentMovimentacao.id, currentMovimentacao)
      .then((response) => {
        setMessage("Informações sobre a Movimentação atualizadas com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar a movimentação: ", error);
        setMessage("Erro ao atualizar a movimentação. Verifique os campos e tente novamente.");
      });
  };
  
  

  const voltarParaLista = () => {
    props.history.push("/Movimentacoes");
  };

  const generateInput = (name, label, type, required) => (
    <div className="form-group" key={name}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        required={required}
        value={currentMovimentacao[name]}
        onChange={handleInputChange}
      />
    </div>
  );

  const generateSelect = (name, label, options) => (
    <div className="form-group" key={name}>
      <label htmlFor={name}>{label}</label>
      <select
        className="form-control"
        id={name}
        name={name}
        required
        value={currentMovimentacao[name]}
        onChange={handleInputChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "" ? "Selecione o Tipo" : option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div>
      {currentMovimentacao ? (
        <div className="edit-form">
          <h4>Movimentação</h4>
          <form>
            {generateInput("produto_id", "Produto ID", "text", true)}
            {generateInput("quantidade", "Quantidade", "text", true)}
            {generateInput("valor", "Valor", "text", true)}
            {generateSelect("tipo", "Tipo", ["", "E", "S"])}
            {generateInput("dataRegistro", "Data de Registro", "datetime-local", true)}
            {generateInput("fornecedor_id", "Fornecedor ID", "text", true)}

            <button type="button" onClick={updateMovimentacao} className="btn btn-success btn-sm">
              Atualizar
            </button>{" "}
            <button onClick={voltarParaLista} className="btn btn-secondary btn-sm">
              Voltar
            </button>

            {message && <strong><p className="text-success">{message}</p></strong>}
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

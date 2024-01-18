import React, { useState } from "react";
import MovimentacaoDataService from "../services/GerencyServiceMov";

const NovaMovimentacao = (props) => {
  const initialMovimentacaotate = {
    id: null,
    produto_id: "",
    quantidade: "",
    valor: "",
    tipo: "",
    dataRegistro: "",
    fornecedor_id: ""
    };
  const [Movimentacao, setMovimentacao] = useState(initialMovimentacaotate);
  const [submitted, setSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;

    // Atualiza o estado imediatamente para campos que não requerem formatação especial.
    let updatedValue = value;

    // Apenas para o campo 'tipo', restringe os valores a 'E' ou 'S'.
    if (name === "tipo") {
        updatedValue = value.toUpperCase();
        if (updatedValue !== "E" && updatedValue !== "S") {
            updatedValue = ""; // Limpa o campo tipo se não for 'E' ou 'S'
        }
    }

    setMovimentacao(prevState => ({
        ...prevState,
        [name]: updatedValue
    }));

    // Verifica a validade do formulário após a atualização do estado.
    setIsFormValid(checkFormValidity({
        ...Movimentacao,
        [name]: updatedValue
    }));
};

  const checkFormValidity = (formState) => {
    const { produto_id, quantidade, valor, tipo, dataRegistro, fornecedor_id } = formState;
    return produto_id && quantidade && valor && tipo && dataRegistro && fornecedor_id;
  };

  const saveMovimentacao = () => {
    let dataFormatada = Movimentacao.dataRegistro;

    if (dataFormatada && dataFormatada.length === 16) {
        dataFormatada += ':00';
    }

    var data = {
        produto_id: Movimentacao.produto_id,
        quantidade: Movimentacao.quantidade,
        valor: Movimentacao.valor,
        tipo: Movimentacao.tipo,
        dataRegistro: dataFormatada,
        fornecedor_id: Movimentacao.fornecedor_id
    };

    MovimentacaoDataService.create(data)
        .then(response => {
            setMovimentacao({
                id: response.data.id,
                produto_id: response.data.produto_id,
                quantidade: response.data.quantidade,
                valor: response.data.valor,
                tipo: response.data.tipo,
                dataRegistro: response.data.dataRegistro,
                fornecedor_id: response.data.fornecedor_id
            });
            setSubmitted(true);
            console.log(response.data);
        })
        .catch(error => {
            if (error.response && error.response.data) {
                // Exibe uma mensagem de erro baseada na resposta do backend
                alert("Erro: não existe esse ID de fornecedor ou produto " + error.response.data.message);
            } else {
                // Exibe uma mensagem de erro genérica se a resposta não for específica
                alert("Ocorreu um erro ao criar a movimentação.");
            }
        });
};


  const newMovimentacao = () => {
    setMovimentacao(initialMovimentacaotate);
    setSubmitted(false);
  };

  const voltarParaLista = () => {
    props.history.push("/Movimentacaoes");
  };


  return (
    <div className="edit-form">
      {submitted ? (
        <div>
          <strong><p className="text-success">Criada com sucesso!</p></strong>
          <button className="btn btn-success" onClick={newMovimentacao}>
            Novo
          </button>
          &nbsp;
          <button className="btn btn-success" onClick={voltarParaLista}>
           Voltar para lista
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="produto_id">produto_id</label>
            <input
              type="text"
              className="form-control"
              id="produto_id"
              required
              value={Movimentacao.produto_id}
              onChange={handleInputChange}
              name="produto_id"
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantidade">quantidade</label>
            <input
              type="text"
              className="form-control"
              id="quantidade"
              required
              value={Movimentacao.quantidade}
              onChange={handleInputChange}
              name="quantidade"
            />
          </div>
          <div className="form-group">
            <label htmlFor="valor">valor</label>
            <input
              type="text"
              className="form-control"
              id="valor"
              required
              value={Movimentacao.valor}
              onChange={handleInputChange}
              name="valor"
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipo">tipo</label>
            <select
              className="form-control"
              id="tipo"
              required
              value={Movimentacao.tipo}
              onChange={handleInputChange}
              name="tipo"
              >
              <option value="">Selecione o Tipo</option>
              <option value="E">Entrada</option>
              <option value="S">Saída</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dataRegistro">dataRegistro</label>
            <input
              type="datetime-local"
              className="form-control"
              id="dataRegistro"
              required
              value={Movimentacao.dataRegistro}
              onChange={handleInputChange}
              name="dataRegistro"
            />
          </div>
          <div className="form-group">
            <label htmlFor="fornecedor_id">fornecedor_id</label>
            <input
              type="text"
              className="form-control"
              id="fornecedor_id"
              required
              value={Movimentacao.fornecedor_id}
              onChange={handleInputChange}
              name="fornecedor_id"
            />
          </div>
          <button onClick={saveMovimentacao} className="btn btn-success" disabled={!isFormValid}>
            Criar
          </button>
        </div>
      )}
    </div>
  );
};

export default NovaMovimentacao;

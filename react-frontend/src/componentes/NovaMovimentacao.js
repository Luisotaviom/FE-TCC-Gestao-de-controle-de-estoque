import React, { useState, useEffect } from 'react';
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
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/Fornecedores')
      .then(response => response.json())
      .then(data => {
        // Assumindo que a resposta seja um objeto com uma chave 'content' que é um array
        if (data.content && Array.isArray(data.content)) {
          setFornecedores(data.content);
        } else {
          console.error('Data is not in expected format:', data);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  
    fetch('http://localhost:8080/Produtos')
      .then(response => response.json())
      .then(data => {
        // Assumindo que a resposta seja um objeto com uma chave 'content' que é um array
        if (data.content && Array.isArray(data.content)) {
          setProdutos(data.content);
        } else {
          console.error('Data is not in expected format:', data);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);
  


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
    props.history.push("/ListaDeMovimentacoes");
  };


  return (
    <div className="edit-form">
      {submitted ? (
        <div>
          <strong><p className="text-success">Criada com sucesso!</p></strong>
          <button className="btn btn-success" onClick={newMovimentacao}>
            Nova movimentação
          </button>
          &nbsp;
          <button className="btn btn-success" onClick={voltarParaLista}>
           Voltar para lista
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
          <label htmlFor="produtoId">Produto ID</label>
          <input
            type="text"
            className="form-control"
            id="produtoId"
            name="produto_id"
            onChange={handleInputChange}
            value={Movimentacao.produto_id}
            list="produtos-list"
          />
          <datalist id="produtos-list">
            {Array.isArray(produtos) && produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>{produto.nome}</option>
            ))}
          </datalist>
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">Quantidade</label>
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
            <label htmlFor="valor">Valor</label>
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
            <label htmlFor="tipo">Tipo</label>
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
            <label htmlFor="dataRegistro">Data de Registro</label>
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
          <label htmlFor="fornecedorId">Fornecedor </label>
          <input
            type="text"
            className="form-control"
            id="fornecedorId"
            name="fornecedor_id"
            onChange={handleInputChange}
            value={Movimentacao.fornecedor_id}
            list="fornecedors-list"
          />
          <datalist id="fornecedors-list">
            {Array.isArray(fornecedores) && fornecedores.map((fornecedor) => (
              <option key={fornecedor.id} value={fornecedor.id}>{fornecedor.nome}</option>
            ))}
          </datalist>
          </div>

          <button onClick={saveMovimentacao} className="btn btn-success" disabled={!isFormValid}>
            Criar movimentação
          </button>
        </div>
      )}
    </div>
  );
};

export default NovaMovimentacao;

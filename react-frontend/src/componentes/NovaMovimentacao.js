import React, { useState, useEffect } from "react";
import MovimentacaoDataService from "../services/GerencyServiceMov";
import style from "../CSS/NovaMovimentacao.module.css";

const NovaMovimentacao = (props) => {
  const initialMovimentacaotate = {
    id: null,
    produto_id: "",
    quantidade: "",
    valor: "",
    tipo: "",
    dataRegistro: "",
    fornecedor_id: "",
  };
  const [Movimentacao, setMovimentacao] = useState(initialMovimentacaotate);
  const [submitted, setSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/Fornecedores")
      .then((response) => response.json())
      .then((data) => {
        if (data.content && Array.isArray(data.content)) {
          setFornecedores(data.content);
        } else {
          console.error("Data is not in expected format:", data);
        }
      })
      .catch((error) => console.error("Fetch error:", error));

    fetch("http://localhost:8080/Produtos")
      .then((response) => response.json())
      .then((data) => {
        if (data.content && Array.isArray(data.content)) {
          setProdutos(data.content);
        } else {
          console.error("Data is not in expected format:", data);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    if (name === "tipo") {
      updatedValue = value.toUpperCase();
      if (updatedValue !== "E" && updatedValue !== "S") {
        updatedValue = "";
      }
    }

    setMovimentacao((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));

    setIsFormValid(
      checkFormValidity({
        ...Movimentacao,
        [name]: updatedValue,
      })
    );
  };

  const checkFormValidity = (formState) => {
    const { produto_id, quantidade, valor, tipo, dataRegistro, fornecedor_id } =
      formState;
    return (
      produto_id && quantidade && valor && tipo && dataRegistro && fornecedor_id
    );
  };

  const saveMovimentacao = () => {
    let dataFormatada = Movimentacao.dataRegistro;

    if (dataFormatada && dataFormatada.length === 16) {
      dataFormatada += ":00";
    }

    var data = {
      produto_id: Movimentacao.produto_id,
      quantidade: Movimentacao.quantidade,
      valor: Movimentacao.valor,
      tipo: Movimentacao.tipo,
      dataRegistro: dataFormatada,
      fornecedor_id: Movimentacao.fornecedor_id,
    };

    MovimentacaoDataService.create(data)
      .then((response) => {
        setMovimentacao({
          id: response.data.id,
          produto_id: response.data.produto_id,
          quantidade: response.data.quantidade,
          valor: response.data.valor,
          tipo: response.data.tipo,
          dataRegistro: response.data.dataRegistro,
          fornecedor_id: response.data.fornecedor_id,
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(
            "Erro: não existe esse ID de fornecedor ou produto " +
              error.response.data.message
          );
        } else {
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
    <div className={style["edit-form"]}>
      {submitted ? (
        <div>
          <strong>
            <p className={style["text-success"]}>Criada com sucesso!</p>
          </strong>
          <button className={`${style["btn_add"]}`} onClick={newMovimentacao}>
            Nova movimentação
          </button>
          <button className={`${style["btn"]}`} onClick={voltarParaLista}>
            Voltar para lista
          </button>
        </div>
      ) : (
        <div>
          <div className={style["form-group"]}>
            <label htmlFor="produtoId">Produto</label>
            <input
              type="text"
              className={style["form-control"]}
              id="produtoId"
              name="produto_id"
              onChange={handleInputChange}
              value={Movimentacao.produto_id}
              list="produtos-list"
            />
            <datalist id="produtos-list">
              {Array.isArray(produtos) &&
                produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome}
                  </option>
                ))}
            </datalist>
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="quantidade">Quantidade</label>
            <input
              type="text"
              className={style["form-control"]}
              id="quantidade"
              required
              value={Movimentacao.quantidade}
              onChange={handleInputChange}
              name="quantidade"
            />
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="valor">Valor</label>
            <input
              type="text"
              className={style["form-control"]}
              id="valor"
              required
              value={Movimentacao.valor}
              onChange={handleInputChange}
              name="valor"
            />
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="tipo">Tipo</label>
            <select
              className={style["form-control"]}
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

          <div className={style["form-group"]}>
            <label htmlFor="dataRegistro">Data de Registro</label>
            <input
              type="datetime-local"
              className={style["form-control"]}
              id="dataRegistro"
              required
              value={Movimentacao.dataRegistro}
              onChange={handleInputChange}
              name="dataRegistro"
            />
          </div>

          <div className={style["form-group"]}>
            <label htmlFor="fornecedorId">Fornecedor </label>
            <input
              type="text"
              className={style["form-control"]}
              id="fornecedorId"
              name="fornecedor_id"
              onChange={handleInputChange}
              value={Movimentacao.fornecedor_id}
              list="fornecedors-list"
            />
            <datalist id="fornecedors-list">
              {Array.isArray(fornecedores) &&
                fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </option>
                ))}
            </datalist>
          </div>

          <button
            onClick={saveMovimentacao}
            className={`${style["btn_add"]}`}
            disabled={!isFormValid}
          >
            Criar movimentação
          </button>
          <button className={`${style["btn"]}`} onClick={voltarParaLista}>
            Voltar para lista
          </button>
        </div>
      )}
    </div>
  );
};

export default NovaMovimentacao;

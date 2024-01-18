import React, { useState } from "react";
import ProdutoDataService from "../services/GerencyService";

const CriarProduto = (props) => {
  const fornecedorId = props.match.params.id;
  if (!fornecedorId) {
      console.error("Fornecedor ID is undefined");
      // Lidar com o caso de ID indefinido, talvez redirecionando de volta ou mostrando uma mensagem
  }

  const initialUserState = {
    id: null,
    nome: "",
    fornecedor_id: "",
    categoria: ""
    };

  const [produto, setProduto] = useState(initialUserState);
  const [submitted, setSubmitted] = useState(false);

  const executarValorAlterado = event => {
    const { name, value } = event.target;
    setProduto({ ...produto, [name]: value });
  };

  const salvar = () => {
    var data = {
      nome: produto.nome,
      categoria: produto.categoria
    };
    
    ProdutoDataService.create(fornecedorId, data)
      .then(response => {
        setProduto({
          id: response.data.id,
          nome: response.data.nome,
          fornecedor_id: response.data.fornecedor_id,
          categoria: response.data.categoria
        });
        
        setSubmitted(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newUser = () => {
    setProduto(initialUserState);
    setSubmitted(false);
  };

  const voltarParaLista = () => {
    props.history.push("/Fornecedores");
  };

  return (
    <div className="edit-form">
      {submitted ? (
        <div>
          <strong><p className="text-success">Criado com sucesso!</p></strong>
          <button className="btn btn-success" onClick={newUser}>
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
            <label htmlFor="nome">nome</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              required
              value={produto.nome}
              onChange={executarValorAlterado}
              name="nome"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">categoria</label>
            <input
              type="text"
              className="form-control"
              id="categoria"
              required
              value={produto.categoria}
              onChange={executarValorAlterado}
              name="categoria"
            />
          </div>

          <button onClick={salvar} className="btn btn-success">
            Criar
          </button>
          &nbsp;
          <button onClick={voltarParaLista} className="btn btn-secondary">
            Voltar
          </button>

        </div>
      )}
    </div>
  );
};

export default CriarProduto;
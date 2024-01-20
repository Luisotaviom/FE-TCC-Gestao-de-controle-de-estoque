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
    categoria: "",
    ativo: true
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
      categoria: produto.categoria,
      ativo: produto.ativo 
    };
    
    ProdutoDataService.create(fornecedorId, data)
      .then(response => {
        setProduto({
          id: response.data.id,
          nome: response.data.nome,
          fornecedor_id: response.data.fornecedor_id,
          categoria: response.data.categoria,
          ativo: response.data.ativo
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
    props.history.push("/ListadeProdutos");
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
            <label htmlFor="nome">Nome</label>
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
            <label htmlFor="categoria">Categoria</label>
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
          <div className="form-group">
            <label htmlFor="ativo">Ativo</label>
            <input
              type="checkbox"
              className="form-control"
              id="ativo"
              checked={produto.ativo}
              onChange={() => setProduto({ ...produto, ativo: !produto.ativo })}
            />
          </div>
          <button onClick={salvar} className="btn btn-success">
            Criar produto
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
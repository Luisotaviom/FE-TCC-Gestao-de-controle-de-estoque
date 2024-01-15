import React, { useState } from "react";
import ProdutoDataService from "../services/GerencyService";

const CriarProduto = (props) => {
  const initialUserState = {
    id: null,
    titulo: "",
    categoria: "",
    anopubli: "",
    autor: "",
    isbn: ""
    };

  const [produto, setProduto] = useState(initialUserState);
  const [submitted, setSubmitted] = useState(false);

  const executarValorAlterado = event => {
    const { name, value } = event.target;
    setProduto({ ...produto, [name]: value });
  };

  const salvar = () => {
    var data = {
      titulo: produto.titulo,
      categoria: produto.categoria,
      anopubli: produto.anopubli,
      autor: produto.autor,
      isbn: produto.isbn

    };
    
    ProdutoDataService.create(data)
      .then(response => {
        setProduto({
          id: response.data.id,
          titulo: response.data.titulo,
          categoria: response.data.categoria,
          anopubli: response.data.anopubli,
          autor: response.data.autor,
          isbn: response.data.isbn
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
    props.history.push("/Produtos");
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
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              className="form-control"
              id="titulo"
              required
              value={produto.titulo}
              onChange={executarValorAlterado}
              name="titulo"
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
            <label htmlFor="anopubli">Ano de Publicação</label>
            <input
              type="number"
              className="form-control"
              id="anopubli"
              required
              value={produto.anopubli}
              onChange={executarValorAlterado}
              name="anopubli"
            />
          </div>

          <div className="form-group">
            <label htmlFor="autor">Autor</label>
            <input
              type="text"
              className="form-control"
              id="autor"
              required
              value={produto.autor}
              onChange={executarValorAlterado}
              name="autor"
            />
          </div>

          <div className="form-group">
            <label htmlFor="isbn">ISBN</label>
            <input
              type="number"
              className="form-control"
              id="isbn"
              required
              value={produto.isbn}
              onChange={executarValorAlterado}
              name="isbn"
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
import React, { useState, useEffect } from "react";
import ProdutoDataService from "../services/GerencyService";

const Produtos = props => {
  const initialProdutoState = {
    id: null,
    nome: "",
    fornecedor_id: "",
    categoria: ""
  };
  const [currentProduto, setCurrentProduto] = useState(initialProdutoState);
  const [message, setMessage] = useState("");

  const getProduto = id => {
    ProdutoDataService.get(id)
      .then(response => {
        setCurrentProduto(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getProduto(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentProduto({ ...currentProduto, [name]: value });
  };


  const updateProduto = () => {
    ProdutoDataService.update(currentProduto.id, currentProduto)
      .then(response => {
        console.log(response.data);
        setMessage("Troca de informações sobre o Produto feita com sucesso!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const voltarParaLista = () => {
    props.history.push("/Produtos");
  };

  return (
    <div>
      {currentProduto ? (
        <div className="edit-form">
          <h4>Produto</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">nome</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                name="nome"
                value={currentProduto.nome}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">categoria</label>
              <input
                type="text"
                className="form-control"
                id="categoria"
                name="categoria"
                value={currentProduto.categoria}
                onChange={handleInputChange}
              />
            </div>

          </form>


          <button type="button" onClick={updateProduto} className="btn btn-success btn-sm">Atualizar</button>
          &nbsp;
          <button onClick={voltarParaLista} className="btn btn-secondary btn-sm">Voltar</button>



          <strong><p className="text-success">{message}</p></strong>


        </div>
      ) : (
        <div>
          <br />
          <p>Clique no Produto...</p>
        </div>
      )}
    </div>
  );
};

export default Produtos;

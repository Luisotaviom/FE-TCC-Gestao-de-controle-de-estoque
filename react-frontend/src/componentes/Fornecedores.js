import React, { useState, useEffect } from "react";
import FornecedoresDataService from "../services/GerencyService2";

const Fornecedores = props => {
  const initialFornecedoresState = {
    id: null,
    nome: "",
    cidade: "",
    celular: "",
    email: "",
    ativo: true
  };
  const [currentFornecedores, setCurrentFornecedores] = useState(initialFornecedoresState);
  const [message, setMessage] = useState("");

  const getFornecedores = id => {
    FornecedoresDataService.get2(id)
      .then(response => {
        setCurrentFornecedores(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getFornecedores(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    if (name === "ativo") {
      setCurrentFornecedores({ ...currentFornecedores, [name]: event.target.checked });
    } else {
      setCurrentFornecedores({ ...currentFornecedores, [name]: value });
    }
  };

  const updateFornecedores = () => {
    FornecedoresDataService.update2(currentFornecedores.id, currentFornecedores)
      .then(response => {
        console.log(response.data);
        setMessage("Troca de informações sobre o fornecedor feita com sucesso!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const voltarParaLista = () => {
    props.history.push("/ListaDeFornecedores");
  };


  return (
    <div>
      {currentFornecedores ? (
        <div className="edit-form">
          <h4>Fornecedor</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                name="nome"
                value={currentFornecedores.nome}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Cidade</label>
              <input
                type="text"
                className="form-control"
                id="cidade"
                name="cidade"
                value={currentFornecedores.cidade}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Telefone</label>
              <input
                type="text"
                className="form-control"
                id="celular"
                name="celular"
                value={currentFornecedores.celular}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={currentFornecedores.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
            <label htmlFor="ativo">Ativo</label>
            <input
              type="checkbox"
              className="form-control"
              id="ativo"
              name="ativo"
              checked={currentFornecedores.ativo}
              onChange={handleInputChange}
            />
          </div>
            
          </form>

          <button type="button" onClick={updateFornecedores} className="btn btn-success btn-sm">Atualizar</button>
          &nbsp;
          <button onClick={voltarParaLista} className="btn btn-secondary btn-sm">Voltar</button>

          <strong><p className="text-success">{message}</p></strong>


        </div>
      ) : (
        <div>
          <br />
          <p>Clique na Fornecedores...</p>
        </div>
      )}
    </div>
  );
};

export default Fornecedores;

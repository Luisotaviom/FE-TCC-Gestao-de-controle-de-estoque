import React, { useState } from "react";
import FornecedorDataService from "../services/GerencyService2";

const NovoFornecedor = (props) => {
  const initialFornecedortate = {
    id: null,
    nome: "",
    cidade: "",
    celular: "",
    email: ""
  };
  const [Fornecedor, setFornecedor] = useState(initialFornecedortate);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFornecedor({ ...Fornecedor, [name]: value });
  };

  const saveFornecedor = () => {
    var data = {
      nome: Fornecedor.nome,
      cidade: Fornecedor.cidade,
      celular: Fornecedor.celular,
      email: Fornecedor.email
    };

    FornecedorDataService.create2(data)
      .then(response => {
        setFornecedor({
          id: response.data.id,
          nome: response.data.nome,
          cidade: response.data.cidade,
          celular: response.data.celular,
          email: response.data.email
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newFornecedor = () => {
    setFornecedor(initialFornecedortate);
    setSubmitted(false);
  };

  const voltarParaLista = () => {
    props.history.push("/Fornecedor");
  };

  return (
    <div className="edit-form">
      {submitted ? (
        <div>
          <strong><p className="text-success">Criada com sucesso!</p></strong>
          <button className="btn btn-success" onClick={newFornecedor}>
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
              value={Fornecedor.nome}
              onChange={handleInputChange}
              name="nome"
            />
          </div>
          <div className="form-group">
            <label htmlFor="cidade">cidade</label>
            <input
              type="text"
              className="form-control"
              id="cidade"
              required
              value={Fornecedor.cidade}
              onChange={handleInputChange}
              name="cidade"
            />
          </div>
          <div className="form-group">
            <label htmlFor="celular">celular</label>
            <input
              type="text"
              className="form-control"
              id="celular"
              required
              value={Fornecedor.celular}
              onChange={handleInputChange}
              name="celular"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              required
              value={Fornecedor.email}
              onChange={handleInputChange}
              name="email"
            />
          </div>
          <button onClick={saveFornecedor} className="btn btn-success">
            Criar
          </button>
        </div>
      )}
    </div>
  );
};

export default NovoFornecedor;

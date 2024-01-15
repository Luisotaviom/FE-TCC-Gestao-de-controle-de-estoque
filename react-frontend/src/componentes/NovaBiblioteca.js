import React, { useState } from "react";
import BibliotecaDataService from "../services/GerencyService2";

const NovaBiblioteca = (props) => {
  const initialBibliotate = {
    id: null,
    nome: ""
  };
  const [Biblioteca, setBiblio] = useState(initialBibliotate);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setBiblio({ ...Biblioteca, [name]: value });
  };

  const saveBiblioteca = () => {
    var data = {
      nome: Biblioteca.nome
    };

    BibliotecaDataService.create2(data)
      .then(response => {
        setBiblio({
          id: response.data.id,
          nome: response.data.nome
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newBiblio = () => {
    setBiblio(initialBibliotate);
    setSubmitted(false);
  };

  const voltarParaLista = () => {
    props.history.push("/Bibliotecas");
  };

  return (
    <div className="edit-form">
      {submitted ? (
        <div>
          <strong><p className="text-success">Criada com sucesso!</p></strong>
          <button className="btn btn-success" onClick={newBiblio}>
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
              value={Biblioteca.nome}
              onChange={handleInputChange}
              name="nome"
            />
          </div>
          <button onClick={saveBiblioteca} className="btn btn-success">
            Criar
          </button>
        </div>
      )}
    </div>
  );
};

export default NovaBiblioteca;

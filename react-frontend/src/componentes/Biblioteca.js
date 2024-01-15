import React, { useState, useEffect } from "react";
import BiblioDataService from "../services/GerencyService2";

const Biblioteca = props => {
  const initialBiblioState = {
    id: null,
    nome: ""
  };
  const [currentBiblioteca, setCurrentBiblio] = useState(initialBiblioState);
  const [message, setMessage] = useState("");

  const getBiblio = id => {
    BiblioDataService.get2(id)
      .then(response => {
        setCurrentBiblio(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getBiblio(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentBiblio({ ...currentBiblioteca, [name]: value });
  };

  const updateBiblio = () => {
    BiblioDataService.update2(currentBiblioteca.id, currentBiblioteca)
      .then(response => {
        console.log(response.data);
        setMessage("Troca de informações sobre a biblioteca feita com sucesso!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const voltarParaLista = () => {
    props.history.push("/Bibliotecas");
  };



  return (
    <div>
      {currentBiblioteca ? (
        <div className="edit-form">
          <h4>Biblioteca</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Nome</label>
              <input
                type="text"
                className="form-control"
                id="nome"
                name="nome"
                value={currentBiblioteca.nome}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button type="button" onClick={updateBiblio} className="btn btn-success btn-sm">Atualizar</button>
          &nbsp;
          <button onClick={voltarParaLista} className="btn btn-secondary btn-sm">Voltar</button>

          <strong><p className="text-success">{message}</p></strong>


        </div>
      ) : (
        <div>
          <br />
          <p>Clique na biblioteca...</p>
        </div>
      )}
    </div>
  );
};

export default Biblioteca;

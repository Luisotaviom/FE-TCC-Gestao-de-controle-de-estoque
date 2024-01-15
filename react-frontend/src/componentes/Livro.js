import React, { useState, useEffect } from "react";
import LivroDataService from "../services/GerencyService";

const Livro = props => {
  const initialLivroState = {
    id: null,
    titulo: "",
    categoria: "",
    anopubli: "",
    autor: "",
    ISBN: ""
  };
  const [currentLivro, setCurrentLivro] = useState(initialLivroState);
  const [message, setMessage] = useState("");

  const getLivro = id => {
    LivroDataService.get(id)
      .then(response => {
        setCurrentLivro(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getLivro(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentLivro({ ...currentLivro, [name]: value });
  };


  const updateLivro = () => {
    LivroDataService.update(currentLivro.id, currentLivro)
      .then(response => {
        console.log(response.data);
        setMessage("Troca de informações sobre o livro feita com sucesso!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const voltarParaLista = () => {
    props.history.push("/Livros");
  };

  return (
    <div>
      {currentLivro ? (
        <div className="edit-form">
          <h4>Livro</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">titulo</label>
              <input
                type="text"
                className="form-control"
                id="titulo"
                name="titulo"
                value={currentLivro.titulo}
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
                value={currentLivro.categoria}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">anopubli</label>
              <input
                type="text"
                className="form-control"
                id="anopubli"
                name="anopubli"
                value={currentLivro.anopubli}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">autor</label>
              <input
                type="text"
                className="form-control"
                id="autor"
                name="autor"
                value={currentLivro.autor}
                onChange={handleInputChange}
              />
            </div>

          </form>


          <button type="button" onClick={updateLivro} className="btn btn-success btn-sm">Atualizar</button>
          &nbsp;
          <button onClick={voltarParaLista} className="btn btn-secondary btn-sm">Voltar</button>



          <strong><p className="text-success">{message}</p></strong>


        </div>
      ) : (
        <div>
          <br />
          <p>Clique no livro...</p>
        </div>
      )}
    </div>
  );
};

export default Livro;

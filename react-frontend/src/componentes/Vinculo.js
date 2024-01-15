import React, { useState } from "react";
import VinculoDataService from "../services/GerencyService4";

const CriarVinculo = (props) => {
  const initialUserState = {
    id: null,
    bibliotecaId: "",
    livroId:""
  };

  const [vinculo, setVinculo] = useState(initialUserState);
  const [submitted, setSubmitted] = useState(false);

  const executarValorAlterado = event => {
    const { name, value } = event.target;
    setVinculo({ ...vinculo, [name]: value });
  };

  const salvar = () => {
    var data = {
        bibliotecaId: vinculo.bibliotecaId,
        livroId: vinculo.livroId
    };
    
    VinculoDataService.create4(data)
      .then(response => {
        setVinculo({
          id: response.data.id,
          bibliotecaId: response.data.bibliotecaId,
          livroId: response.data.livroId
        });
        
        setSubmitted(true);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newVinculo = () => {
    setVinculo(initialUserState);
    setSubmitted(false);
  };

  const voltarParaLista = () => {
    props.history.push("/BibliotecaGerency");
  };

  return (
    <div className="edit-form">
      {submitted ? (
        <div>
          <strong><p className="text-success">Vinculado com sucesso!</p></strong>
          <button className="btn btn-success" onClick={newVinculo}>
            Novo Vínculo
          </button>
          &nbsp;
          <button className="btn btn-success" onClick={voltarParaLista}>
            Voltar
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="titulo">Livro ID</label>
            <input
              type="text"
              className="form-control"
              id="livroId"
              required
              value={vinculo.livroId}
              onChange={executarValorAlterado}
              name="livroId"
            />
          </div>

          <div className="form-group">
            <label htmlFor="titulo">Biblioteca ID</label>
            <input
              type="text"
              className="form-control"
              id="bibliotecaId"
              required
              value={vinculo.bibliotecaId}
              onChange={executarValorAlterado}
              name="bibliotecaId"
            />
          </div>

          <button onClick={salvar} className="btn btn-success">
            Vincular
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
export default CriarVinculo;
import http from "../http-common";

const getAll5 = (fornecedor_id, params) => {
  return http.get(`/Produtos/fornecedor/${fornecedor_id}`, { params });
};

const getLivroTitulo = (titulo) => {
  return http.get(`/BibliotecaGerency/livroPorTitulo?titulo=${titulo}`);
};

const GerencyServer5 = {
  getAll5,
  getLivroTitulo
};


export default GerencyServer5;

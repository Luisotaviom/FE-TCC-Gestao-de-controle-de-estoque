import http from "../http-common";

const getAll5 = (fornecedor_id, params) => {
  return http.get(`/Produtos/fornecedor/${fornecedor_id}`, { params });
};


const GerencyServer5 = {
  getAll5,
};


export default GerencyServer5;

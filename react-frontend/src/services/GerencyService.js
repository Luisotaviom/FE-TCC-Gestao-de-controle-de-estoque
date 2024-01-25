import http from "../http-common";

const get = (id) => {
  return http.get(`/Produtos/${id}`);
};

const create = (id, data) => {
  return http.post(`/Produtos/fornecedor/${id}/produto`, data);
};

const update = (id, data) => {
  return http.put(`/Produtos/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/Produtos/${id}`);
};

const getAll = (params) => {
  return http.get("/Produtos", { params });
};

const getStatus = (params) => {
  return http.get("/Produtos/buscarPorStatus", { params });
};

const getNome = (params) => {
  return http.get("/Produtos/produtosPorNome", { params });
};

const GerencyServer = {
  getAll,
  get,
  create,
  update,
  remove,
  getStatus,
  getNome
};


export default GerencyServer;

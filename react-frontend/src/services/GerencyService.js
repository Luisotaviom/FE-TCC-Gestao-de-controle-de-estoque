import http from "../http-common";

const get = (id) => {
  return http.get(`/Produtos/${id}`);
};

const create = (data) => {
  return http.post(`/Produtos/fornecedor/${id}`/`produto`, data);
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


const GerencyServer = {
  getAll,
  get,
  create,
  update,
  remove
};


export default GerencyServer;

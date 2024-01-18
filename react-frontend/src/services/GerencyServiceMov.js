import http from "../http-common";

const get = (id) => {
  return http.get(`/Movimentacoes/${id}`);
};

const create = (data) => {
  return http.post(`/Movimentacoes`, data);
};

const update = (id, data) => {
  return http.put(`/Movimentacoes/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/Movimentacoes/${id}`);
};

const getAll = (params) => {
  return http.get("/Movimentacoes", { params });
};

const getTipos = (params) => {
  return http.get("/Movimentacoes/buscarPorTipo", { params });
};


const GerencyServerMov = {
  getAll,
  get,
  create,
  update,
  getTipos,
  remove
};


export default GerencyServerMov;

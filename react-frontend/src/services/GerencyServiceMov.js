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

const getData = (params) => {
  return http.get("/Movimentacoes/buscarPorData", { params });
};

const getDataETipo = (params) => {
  return http.get("/Movimentacoes/buscar", { params });
};

const getRelatorioSemanal= (params) => {
  return http.get("Movimentacoes/relatorio/semanal", { params });
};

const getRelatorioMensal = (params) => {
  return http.get("/Movimentacoes/relatorio/mensal", { params });
};

const getTiposRelatorios = (params) => {
  return http.get("/Movimentacoes/buscarPorTipo", { params });
};


const GerencyServerMov = {
  getAll,
  get,
  create,
  update,
  getTipos,
  remove,
  getData,
  getDataETipo,
  getRelatorioSemanal,
  getRelatorioMensal,
  getTiposRelatorios
};


export default GerencyServerMov;

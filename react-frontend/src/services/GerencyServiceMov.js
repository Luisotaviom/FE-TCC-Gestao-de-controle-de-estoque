import axiosInstance from "../services/axios";

const get = (id) => {
  return axiosInstance.get(`/Movimentacoes/${id}`);
};

const create = (data) => {
  return axiosInstance.post(`/Movimentacoes`, data);
};

const update = (id, data) => {
  return axiosInstance.put(`/Movimentacoes/${id}`, data);
};

const remove = (id) => {
  return axiosInstance.delete(`/Movimentacoes/${id}`);
};

const getAll = (params) => {
  return axiosInstance.get("/Movimentacoes", { params });
};

const getTipoCategoria = (params) => {
  return axiosInstance.get("/Movimentacoes/buscarTipoCategoria", {
    params,
  });
};

const getRelatorioSemanal = (params) => {
  return axiosInstance.get("/Movimentacoes/relatorio/semanal", { params });
};

const getRelatorioMensal = (params) => {
  const defaultParams = { size: 500, ...params };
  return axiosInstance.get("/Movimentacoes/relatorio/mensal", {
    params: defaultParams,
  });
};

const getTiposRelatorios = (params) => {
  return axiosInstance.get("/Movimentacoes/buscarPorTipo", { params });
};

const GerencyServerMov = {
  getAll,
  get,
  create,
  update,
  remove,
  getTipoCategoria,
  getRelatorioSemanal,
  getRelatorioMensal,
  getTiposRelatorios,
};

export default GerencyServerMov;

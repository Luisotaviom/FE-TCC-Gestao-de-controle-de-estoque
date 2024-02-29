import axiosInstance from "../services/axios";

const get = (id) => {
  return axiosInstance.get(`/Produtos/${id}`);
};

const create = (id, data) => {
  return axiosInstance.post(`/Produtos/fornecedor/${id}/produto`, data);
};

const update = (id, data) => {
  return axiosInstance.put(`/Produtos/${id}`, data);
};

const remove = (id) => {
  return axiosInstance.delete(`/Produtos/${id}`);
};

const getAll = (params) => {
  return axiosInstance.get("/Produtos", { params });
};

const NomeEStatus = (params) => {
  return axiosInstance.get("/Produtos/NomeEStatus", { params });
};

const GerencyServer = {
  getAll,
  get,
  create,
  update,
  remove,
  NomeEStatus,
};

export default GerencyServer;

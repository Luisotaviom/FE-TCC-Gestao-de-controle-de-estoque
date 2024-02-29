import axiosInstance from "../services/axios";

const get2 = (id) => {
  return axiosInstance.get(`/Fornecedores/${id}`);
};

const create2 = (data) => {
  return axiosInstance.post("/Fornecedores", data);
};

const update2 = (id, data) => {
  return axiosInstance.put(`/Fornecedores/${id}`, data);
};

const remove2 = (id) => {
  return axiosInstance.delete(`/Fornecedores/${id}`);
};

const getAll2 = (params) => {
  return axiosInstance.get("/Fornecedores", { params });
};

const getStatus = (params) => {
  return axiosInstance.get("/Fornecedores/buscarPorStatus", { params });
};

const GerencyServer2 = {
  getAll2,
  get2,
  create2,
  update2,
  remove2,
  getStatus
};

export default GerencyServer2;

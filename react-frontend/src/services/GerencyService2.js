import http from "../http-common";

const get2 = (id) => {
  return http.get(`/Fornecedores/${id}`);
};

const create2 = (data) => {
  return http.post("/Fornecedores", data);
};

const update2 = (id, data) => {
  return http.put(`/Fornecedores/${id}`, data);
};

const remove2 = (id) => {
  return http.delete(`/Fornecedores/${id}`);
};

const getAll2 = (params) => {
  return http.get("/Fornecedores", { params });
};

const getStatus = (params) => {
  return http.get("/Fornecedores/buscarPorStatus", { params });
};


const GerencyServer2 = {
  getAll2,
  get2,
  create2,
  update2,
  getStatus,
  remove2
};

export default GerencyServer2;

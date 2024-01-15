import http from "../http-common";

const get2 = (id) => {
  return http.get(`/Bibliotecas/${id}`);
};

const create2 = (data) => {
  return http.post("/Bibliotecas", data);
};

const update2 = (id, data) => {
  return http.put(`/Bibliotecas/${id}`, data);
};

const remove2 = (id) => {
  return http.delete(`/Bibliotecas/${id}`);
};

const getAll2 = (params) => {
  return http.get("/Bibliotecas", { params });
};


const GerencyServer2 = {
  getAll2,
  get2,
  create2,
  update2,
  remove2
};

export default GerencyServer2;

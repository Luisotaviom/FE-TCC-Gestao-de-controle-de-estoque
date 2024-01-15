import http from "../http-common";

const get = (id) => {
  return http.get(`/Livros/${id}`);
};

const create = (data) => {
  return http.post("/Livros", data);
};

const update = (id, data) => {
  return http.put(`/Livros/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/Livros/${id}`);
};

const getAll = (params) => {
  return http.get("/Livros", { params });
};


const GerencyServer = {
  getAll,
  get,
  create,
  update,
  remove
};


export default GerencyServer;

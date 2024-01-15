import http from "../http-common";

const get3 = (id) => {
  return http.get(`/BibliotecaGerency/${id}`);
};

const create3 = (data) => {
  return http.post("/BibliotecaGerency", data);
};

const update3 = (id, data) => {
  return http.put(`/BibliotecaGerency/${id}`, data);
};

const remove3 = (idBiblio, idLivro) => {
  return http.delete(`/BibliotecaGerency/${idBiblio}/Livros/${idLivro}`);
};

const getAll3 = (params) => {
  return http.get("/BibliotecaGerency", { params });
};


const GerencyServer3 = {
  getAll3,
  get3,
  create3,
  update3,
  remove3,
};

export default GerencyServer3;

import http from "../http-common";

const get3 = (id) => {
  return http.get(`/Gerency/${id}`);
};

const create3 = (data) => {
  return http.post("/Gerency", data);
};

const update3 = (id, data) => {
  return http.put(`/Gerency/${id}`, data);
};

const remove3 = (idBiblio, idLivro) => {
  return http.delete(`/Gerency/${idBiblio}/Livros/${idLivro}`);
};

const getAll3 = (params) => {
  return http.get("/Gerency", { params });
};


const GerencyServer3 = {
  getAll3,
  get3,
  create3,
  update3,
  remove3,
};

export default GerencyServer3;

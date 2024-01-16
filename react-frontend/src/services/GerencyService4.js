import http from "../http-common";

const get4 = (id) => {
  return http.get(`/Gerency/${id}`);
};

const getAll4 = (params) => {
  return http.get("/Gerency", { params });
};

const getPorTitulo = (titulo) => {
  return http.get(`/livroPorTitulo?` + titulo);
};


const GerencyServer4 = {
  getAll4,
  get4,
  getPorTitulo,
};


export default GerencyServer4;

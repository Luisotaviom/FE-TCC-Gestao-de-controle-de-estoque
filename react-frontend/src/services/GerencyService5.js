import axiosInstance from "../services/axios";

const getAll5 = (fornecedor_id, params) => {
  return axiosInstance.get(`/Produtos/fornecedor/${fornecedor_id}`, { params });
};

const GerencyServer5 = {
  getAll5,
};

export default GerencyServer5;

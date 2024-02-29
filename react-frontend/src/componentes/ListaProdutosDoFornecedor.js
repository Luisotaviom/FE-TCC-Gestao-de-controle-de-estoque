import React, { useState, useEffect, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ListaProdutosDoFornecedorDataService from "../services/GerencyService5";
import Select from "react-select";
import styles from "../CSS/listaproduto.module.css";

const ListaProdutosDoFornecedor = (props) => {
  const [produtosDoFornecedor, definirListaProdutosDoFornecedor] = useState([]);
  const produtosDoFornecedorRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [3, 6, 9, 12];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  produtosDoFornecedorRef.current = produtosDoFornecedor;

  useEffect(() => {
    buscarProdutosDoFornecedor();
  }, [page, pageSize, selectedStatus, searchTerm]);

  const buscarProdutosDoFornecedor = () => {
    setIsLoading(true);
    const params = buscarVariaveisDePaginacao(page, pageSize);
    const { fornecedor_id } = props.match.params;

    ListaProdutosDoFornecedorDataService.getAll5(fornecedor_id, params)
      .then((response) => {
        const produtosDoFornecedor = response.data.content;
        const totalPages = response.data.totalPages;

        definirListaProdutosDoFornecedor(produtosDoFornecedor);
        setCount(totalPages);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos do fornecedor:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const buscarVariaveisDePaginacao = (page, pageSize) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption);
  };

  const openProdutos = (produtoId) => {
    props.history.push("/Produtos/" + produtoId);
  };

  return (
    <div className={`${styles.list} row`}>
      <div className="col-md-12">
        <h2 className={styles.h2}>Lista de Produtos do Fornecedor</h2>
        <div className="d-flex justify-content-between mt-3">
          <div>
            <span>Status:</span>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedStatus}
              isClearable={true}
              isSearchable={true}
              options={[
                { value: true, label: "Ativo" },
                { value: false, label: "Inativo" },
              ]}
              onChange={handleStatusChange}
              placeholder="Selecione o status"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Buscar por nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center">Carregando...</div>
        ) : (
          <div className={styles.cardContainer}>
            {produtosDoFornecedor.map((produto) => (
              <div key={produto.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h5>{produto.nome}</h5>
                </div>
                <div className={styles.cardBody}>
                  <p>Categoria: {produto.categoria}</p>
                  <button
                    type="button"
                    className={styles.button_edit}
                    onClick={() => openProdutos(produto.id)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3">
          <span>Itens por página: </span>
          <select onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Pagination
            color="primary"
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ListaProdutosDoFornecedor;

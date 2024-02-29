import React, { useState, useEffect } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ProdutosDataService from "../services/GerencyService";
import styles from "../CSS/listaproduto.module.css";
import Select from "react-select";

const ListaDeProdutos = (props) => {
  const [produtos, definirProdutos] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(3); // Alterando o valor inicial para 3
  const pageSizes = [3, 6, 9, 12]; // Atualizando os tamanhos possíveis da página
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    buscarProdutos();
  }, [page, pageSize, selectedStatus, searchTerm]);

  const buscarProdutos = async () => {
    setIsLoading(true);
    const statusAtivo = selectedStatus ? selectedStatus.value : null;
    const params = buscarVariaveisDePaginacao(
      page,
      pageSize,
      statusAtivo,
      searchTerm
    );

    try {
      let response;
      if (statusAtivo !== null || searchTerm !== "") {
        response = await ProdutosDataService.NomeEStatus(params);
      } else {
        response = await ProdutosDataService.getAll(params);
      }

      definirProdutos(response.data.content);
      setCount(Math.ceil(response.data.totalPages));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarVariaveisDePaginacao = (page, pageSize, ativo, nome) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    if (ativo !== null) {
      params["ativo"] = ativo; // Certifique-se de que este é o nome correto do parâmetro esperado pelo backend
    }

    if (nome) {
      params["nome"] = nome;
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

  const openProduto = (id) => {
    props.history.push("/Produtos/" + id);
  };

  const opcoesStatus = [
    { value: true, label: "Ativo" },
    { value: false, label: "Inativo" },
  ];

  return (
    <div className={`${styles.list} row`}>
      <div className="col-md-12">
        <h2 className={styles.h2}>Lista de Produtos</h2>
        <div className="d-flex justify-content-between mt-3">
          <div>
            <span className="mr-2">Status:</span>
            <Select
              className="basic-single"
              classNamePrefix="select"
              value={selectedStatus}
              isClearable={true}
              isSearchable={true}
              options={opcoesStatus}
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

        <div className={styles.cardContainer}>
          {produtos.map((produto) => (
            <div key={produto.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h5>{produto.nome}</h5>
              </div>
              <div className={styles.cardBody}>
                <p>
                  Fornecedor:{" "}
                  {`${produto.fornecedor_id} (${produto.fornecedorNome})`}
                </p>
                <p>Categoria: {produto.categoria}</p>
                <p>
                  Status:{" "}
                  <span className={produto.ativo ? "ativo" : "inativo"}>
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </span>
                </p>

                <button
                  type="button"
                  className={styles.button_edit}
                  onClick={() => openProduto(produto.id)} // Corrigido para o nome correto da função
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          className={`${styles.button_add}`}
          onClick={() => props.history.push("/ListaDeFornecedores")}
        >
          Criar Produto
        </button>
      </div>

      <div className="mt-3">
        <div>
          <span className="mr-2">Itens por página:</span>
          <select
            className="custom-select"
            style={{ width: "auto" }}
            onChange={handlePageSizeChange}
            value={pageSize}
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

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
  );
};

export default ListaDeProdutos;

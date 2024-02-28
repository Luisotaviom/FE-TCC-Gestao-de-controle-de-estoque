import React, { useState, useEffect } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ProdutosDataService from "../services/GerencyService";
import styles from '../CSS/listaproduto.module.css'; 
import Select from 'react-select';

const ListaDeProdutos = (props) => {
  const [produtos, definirProdutos] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];
  const [searchTerm, setSearchTerm] = useState("");


  const buscarVariaveisDePaginacao = (page, pageSize, ativo, nome) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }
    
    if (ativo !== null) {
      params["ativo"] = ativo;
    }
    
    if (nome) {
      params["nome"] = nome;
    }

    return params;
  };

  const buscarProdutos = () => {
    const statusAtivo = selectedStatus ? selectedStatus.value : null;
    const params = buscarVariaveisDePaginacao(page, pageSize, statusAtivo, searchTerm);
    
    ProdutosDataService.getAll(params) 
      .then(handleResponse)
      .catch(handleError);

      ProdutosDataService.NomeEStatus(params) 
      .then(handleResponse)
      .catch(handleError);
  };

  const handleResponse = (response) => {
    const { content, totalPages } = response.data;

    definirProdutos(content);
    setCount(totalPages);
  };

  const handleError = (error) => {
    console.error(error);
  };

  useEffect(buscarProdutos, [page, pageSize, selectedStatus, searchTerm]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleStatusChange = selectedOption => {
    setSelectedStatus(selectedOption);
  };

  const openProduto = (id) => {
    props.history.push("/Produtos/" + id);
  };

  const opcoesStatus = [
    { value: true, label: 'Ativo' },
    { value: false, label: 'Inativo' }
  ];

  
  return (
    <div className={`${styles.list} row`}>
    <div className="col-md-12">
      <h2 className={styles.h2}>Lista de Produtos</h2>
      <div className="d-flex justify-content-between mt-3">
          <div>
              <span className="mr-2">Itens por página:</span>
              <select className={`${styles.select}`} onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          </div>

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
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button onClick={buscarProdutos}>Pesquisar</button>
          </div>
        </div>

        <div className={styles.cardContainer}>
        {produtos.map((produto) => (
          <div key={produto.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h5>{produto.nome}</h5>
            </div>
            <div className={styles.cardBody}>
              <p>Fornecedor: {`${produto.fornecedor_id} (${produto.fornecedorNome})`}</p>
              <p>Categoria: {produto.categoria}</p>
              <p>Status: <span className={produto.ativo ? 'ativo' : 'inativo'}>{produto.ativo ? 'Ativo' : 'Inativo'}</span></p>

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

        <table
            className={`table ${styles.listTable}`}
        >
          <thead>
            {((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>


                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {((row, i) => {
              ;
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        

        <div className="mt-3">
          {"Itens por página: "}
          <select onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <div>
            <button type="button" className={`${styles.button_add}`} onClick={() => props.history.push("/ListaDeFornecedores")}>
              Criar Produto
            </button>
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

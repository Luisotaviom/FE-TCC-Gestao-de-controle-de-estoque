import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ProdutosDataService from "../services/GerencyService";
import { useTable } from "react-table";
import styles from './css.module.css'; // Ajuste o caminho conforme necessário


const ListaDeProdutos = (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [produtos, definirProdutos] = useState([]);
  const [statusAtivo, setStatusAtivo] = useState("");
  const produtosRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];

  produtosRef.current = produtos;

  const buscarVariaveisDePaginacao = (page, pageSize, ativo) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }
    
    if (ativo) {
      params["ativo"] = ativo;
    }

    return params;
  };

  const buscarProdutos = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize, statusAtivo);
  
    if (statusAtivo !== "") {
      // Se um status específico foi selecionado, use getFornecedoresPorStatus
      ProdutosDataService.getStatus({ ...params, ativo: statusAtivo })
        .then(handleResponse)
        .catch(handleError);
    } else {
      // Se nenhum status foi selecionado, busque todos os fornecedores
      ProdutosDataService.getAll(params)
        .then(handleResponse)
        .catch(handleError);
    }
  };

  const handleResponse = (response) => {
    const movimentacoes = response.data.content;
    const totalPages = response.data.totalPages;

    definirProdutos(movimentacoes);
    setCount(totalPages);
  };

  const handleError = (error) => {
    console.error(error); // Exemplo de saída do erro
  };

  useEffect(buscarProdutos, [page, pageSize, statusAtivo]);

  const openProdutos = (rowIndex) => {
    const id = produtosRef.current[rowIndex].id;

    props.history.push("/Produtos/" + id);
  };


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    const valor = event.target.value;
  
    // Comparar diretamente com as strings "true" e "false"
    setStatusAtivo(valor);
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Nome",
        accessor: "nome",
      },
      {
        Header: "Fornecedor",
        accessor: row => `${row.fornecedor_id} (${row.fornecedorNome})`,
        id: "fornecedor", // Este é um identificador único para a coluna, necessário se você usa uma função para accessor
      },  
      {
        Header: "Categoria",
        accessor: "categoria",
      },
      {
        Header: "Status",
        accessor: "ativo",
        Cell: ({ row }) => (
          <div style={{ textAlign: "center" }} className={row.original.ativo ? "ativo" : "inativo"}>
            {row.original.ativo ? "Ativo" : "Desativado"}
          </div>
        )
      },
      {
        Header: "Ações",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            
            <div>
              <span onClick={() => openProdutos(rowIdx)}>
                <button type="button" className="btn btn-warning btn-sm">Editar</button>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: produtos,
  });

  return (
    <div className={`${styles.list} row`}>
    <div className="col-md-12">
      <h2 className={styles.h2}>Lista de Produtos</h2>
      <div className="d-flex justify-content-between mt-3">
      <div>
            <span className="mr-2">Itens por página:</span>
            <select className="custom-select" style={{ width: 'auto' }} onChange={handlePageSizeChange} value={pageSize}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
          <span className="mr-2">Status:</span>
            <select className="custom-select" style={{ width: 'auto' }} onChange={handleStatusChange} value={statusAtivo}>
              <option value="">Todos</option>
              <option value={true}>Ativo</option>
              <option value={false}>Desativado</option>
            </select>
          </div>
          <button type="button" className="btn btn-success" onClick={() => props.history.push("/ListaDeFornecedores")}>
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

        <table
            {...getTableProps()}
            className={`table ${styles.listTable}`}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>


                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
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

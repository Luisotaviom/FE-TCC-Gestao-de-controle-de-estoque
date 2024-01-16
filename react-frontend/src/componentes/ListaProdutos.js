import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ProdutosDataService from "../services/GerencyService";
import { useTable } from "react-table";

const ListaDeProdutos = (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [produtos, definirProdutos] = useState([]);
  const produtosRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];

  produtosRef.current = produtos;

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

  const buscarProdutos = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize);

    ProdutosDataService.getAll(params)
      .then((response) => {
        console.log(response)
        const produtos = response.data.content;
        const totalPages = response.data.totalPages;

        definirProdutos(produtos);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(buscarProdutos, [page, pageSize]);

  const openProdutos = (rowIndex) => {
    const id = produtosRef.current[rowIndex].id;

    props.history.push("/Produtos/" + id);
  };


  const deleteProdutos = (rowIndex) => {
    const id = produtosRef.current[rowIndex].id;

    ProdutosDataService.remove(id)
      .then((response) => {
        props.history.push("/Produtos");

        let novosProdutos = [...produtosRef.current];
        novosProdutos.splice(rowIndex, 1);

        definirProdutos(novosProdutos);
      })
      .catch((e) => {
        console.log(e);
      });
  };


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "nome",
        accessor: "nome",
      },
      {
        Header: "fornecedor_id",
        accessor: "fornecedor_id",
      },
      {
        Header: "Categoria",
        accessor: "categoria",
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
              &nbsp;
              <span onClick={() => deleteProdutos(rowIdx)}>
                <button type="button" className="btn btn-danger btn-sm">Remover</button>
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
    <div className="list row">
      <div className="col-md-12 list">
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

        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
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
          <div className="mt-3">
            <button type="button" className="btn btn-success" onClick={() => props.history.push("/NovoProduto")}>
            Adicionar Produtos
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
    </div>
  );
};

export default ListaDeProdutos;

import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import LivroDataService from "../services/GerencyService";
import { useTable } from "react-table";

const ListaDeLivros = (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [livros, definirLivro] = useState([]);
  const livroRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];

  livroRef.current = livros;

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

  const buscarLivros = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize);

    LivroDataService.getAll(params)
      .then((response) => {
        console.log(response)
        const livros = response.data.content;
        const totalPages = response.data.totalPages;

        definirLivro(livros);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(buscarLivros, [page, pageSize]);

  const openLivro = (rowIndex) => {
    const id = livroRef.current[rowIndex].id;

    props.history.push("/Livros/" + id);
  };


  const deleteLivro = (rowIndex) => {
    const id = livroRef.current[rowIndex].id;

    LivroDataService.remove(id)
      .then((response) => {
        props.history.push("/Livros");

        let novosLivros = [...livroRef.current];
        novosLivros.splice(rowIndex, 1);

        definirLivro(novosLivros);
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
        Header: "Titulo",
        accessor: "titulo",
      },
      {
        Header: "Categoria",
        accessor: "categoria",
      },
      {
        Header: "Anopubli",
        accessor: "anopubli",
      },
      {
        Header: "Autor",
        accessor: "autor",
      },
      {
        Header: "ISBN",
        accessor: "isbn",
      },
      {
        Header: "Ações",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            
            <div>
              <span onClick={() => openLivro(rowIdx)}>
                <button type="button" className="btn btn-warning btn-sm">Editar</button>
              </span>
              &nbsp;
              <span onClick={() => deleteLivro(rowIdx)}>
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
    data: livros,
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
            <button type="button" className="btn btn-success" onClick={() => props.history.push("/NovoLivro")}>
            Adicionar Livro
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

export default ListaDeLivros;

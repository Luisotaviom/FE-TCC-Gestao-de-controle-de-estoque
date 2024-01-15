import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import ListaLivrosDasBibliotecasDataService from "../services/GerencyService5";
import { useTable } from "react-table";

const ListaLivrosDasBiblio = (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [livrosDaBibliotecas, definirListaLivrosDasBiblio] = useState([]);
  const listaLivrosDasBiblioRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];

  listaLivrosDasBiblioRef.current = livrosDaBibliotecas;

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

  const buscarLivrosDaBiblios = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize);
    const { id } = props.match.params;    

    ListaLivrosDasBibliotecasDataService.getAll5(id, params)
      .then((response) => {
        console.log(response)
        const livrosDaBiblio = response.data.content;
        const totalPages = response.data.totalPages;

        definirListaLivrosDasBiblio(livrosDaBiblio);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(buscarLivrosDaBiblios, [page, pageSize]);

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
        Header: "nome Biblioteca",
        accessor: "nomeBiblioteca",
      },
      {
        Header: "titulo Livro",
        accessor: "tituloLivro",
      },
      {
        Header: "codigo isbn",
        accessor: "codigoisbn",
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
    data: livrosDaBibliotecas,
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

export default ListaLivrosDasBiblio;

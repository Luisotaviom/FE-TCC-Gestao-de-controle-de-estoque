import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import BibliotecaDataService from "../services/GerencyService2";
import { useTable } from "react-table";

const ListaDeBibliotecas = (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [bibliotecas, definirBiblio] = useState([]);
  const biblioRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];

  biblioRef.current = bibliotecas;

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

  const buscarBiblios = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize);

    BibliotecaDataService.getAll2(params)
      .then((response) => {
        console.log(response)
        const bibliotecas = response.data.content;
        const totalPages = response.data.totalPages;

        definirBiblio(bibliotecas);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openBiblio = (rowIndex) => {
    const id = biblioRef.current[rowIndex].id;

    props.history.push("/Bibliotecas/" + id);
  };

  const openBiblioLivros = (rowIndex) => {
    const id = biblioRef.current[rowIndex].id;

    props.history.push("/BibliotecaGerency/livrosDaBiblioteca/" + id);
  };


  const deleteBiblio = (rowIndex) => {
    const id = biblioRef.current[rowIndex].id;

    BibliotecaDataService.remove2(id)
      .then((response) => {
        props.history.push("/Bibliotecas");

        let novasBiblios= [...biblioRef.current];
        novasBiblios.splice(rowIndex, 1);

        definirBiblio(novasBiblios);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(buscarBiblios, [page, pageSize]);

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
        Header: "Nome",
        accessor: "nome",
      },
      {
        Header: "Ações",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;

          return (
            <div>
              <span onClick={() => openBiblio(rowIdx)}>
                <button type="button" className="btn btn-warning btn-sm">Editar</button>
              </span>
              &nbsp;
              <span onClick={() => deleteBiblio(rowIdx)}>
                <button type="button" className="btn btn-danger btn-sm">Remover</button>
              </span>
              &nbsp;
              <span onClick={() => openBiblioLivros(rowIdx)}>
                <button type="button" className="btn btn-success btn-sm">Ver livros</button>
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
    data: bibliotecas,
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
            <button type="button" className="btn btn-success" onClick={() => props.history.push("/NovaBiblioteca")}>
            Adicionar biblioteca
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

export default ListaDeBibliotecas;

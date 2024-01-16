import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import BibliotecaGerencyDataService from "../services/GerencyService3";
import { useTable } from "react-table";

const ListaDeBibliotecaGerency= (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [bibliotecaGerency, definirBibliotecaGerency] = useState([]);
  const bibliotecaGerencyRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];

  bibliotecaGerencyRef.current = bibliotecaGerency;

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

  const buscarBibliotecaGerency = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize);

    BibliotecaGerencyDataService.getAll3(params)
      .then((response) => {
        console.log(response)
        const bibliotecaGerency = response.data.content;
        const totalPages = response.data.totalPages;

        definirBibliotecaGerency(bibliotecaGerency);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(buscarBibliotecaGerency, [page, pageSize]);


    const deleteBibliotecaGerency = (idBiblio, idLivro, rowIndex) => {
    if (!idBiblio || !idLivro) {
      console.error("IDs inválidos:", { idBiblio, idLivro });
      return;
    }

    BibliotecaGerencyDataService.remove3(idLivro, idBiblio)
      .then((response) => {
        props.history.push("/BibliotecaGerency");

        let novosVinculos = [...bibliotecaGerencyRef.current];
        novosVinculos.splice(rowIndex, 1);

        definirBibliotecaGerency(novosVinculos);
      })
      .catch((e) => {
        console.error(e);
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
        Header: "nomeProduto",
        accessor: "nomeProduto",
      },
      {
        Header: "nomeFornecedor",
        accessor: "nomeFornecedor",
      },
      {
        Header: "Ações",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => deleteBibliotecaGerency(rowIdx)}>
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
    data: bibliotecaGerency,
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
            <button type="button" className="btn btn-success" onClick={() => props.history.push("/Vinculo")}>
            Vincular livro e biblioteca
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

export default ListaDeBibliotecaGerency;

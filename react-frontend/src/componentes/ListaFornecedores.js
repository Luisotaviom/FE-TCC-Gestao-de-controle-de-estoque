import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import FornecedoresDataService from "../services/GerencyService2";
import { useTable } from "react-table";

const ListaDeFornecedores = (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [fornecedores, definirFornecedores] = useState([]);
  const fornecedoresRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];

  fornecedoresRef.current = fornecedores;

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

  const buscarFornecedores = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize);

    FornecedoresDataService.getAll2(params)
      .then((response) => {
        console.log(response)
        const fornecedores = response.data.content;
        const totalPages = response.data.totalPages;

        definirFornecedores(fornecedores);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openFornecedores = (rowIndex) => {
    const id = fornecedoresRef.current[rowIndex].id;

    props.history.push("/Fornecedores/" + id);
  };

  const openFornecedorProduto = (rowIndex) => {
    const id = fornecedoresRef.current[rowIndex].id;

    props.history.push("/Gerency/produtosDoFornecedor/" + id);
  };


  const deleteFornecedores = (rowIndex) => {
    const id = fornecedoresRef.current[rowIndex].id;

    FornecedoresDataService.remove2(id)
      .then((response) => {
        props.history.push("/Fornecedores");

        let novasFornecedores= [...fornecedoresRef.current];
        novasFornecedores.splice(rowIndex, 1);

        definirFornecedores(novasFornecedores);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(buscarFornecedores, [page, pageSize]);

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
        Header: "cidade",
        accessor: "cidade",
      },
      {
        Header: "celular",
        accessor: "celular",
      },
      {
        Header: "email",
        accessor: "email",
      },
      {
        Header: "Ações",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;

          return (
            <div>
              <span onClick={() => openFornecedores(rowIdx)}>
                <button type="button" className="btn btn-warning btn-sm">Editar</button>
              </span>
              &nbsp;
              <span onClick={() => deleteFornecedores(rowIdx)}>
                <button type="button" className="btn btn-danger btn-sm">Remover</button>
              </span>
              &nbsp;
              <span onClick={() => openFornecedorProduto(rowIdx)}>
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
    data: fornecedores,
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
            <button type="button" className="btn btn-success" onClick={() => props.history.push("/NovoFornecedor")}>
            Adicionar Fornecedores
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

export default ListaDeFornecedores;

import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import MovimentacoesDataService from "../services/GerencyServiceMov";
import { useTable } from "react-table";

const ListaDeMovimentacoes = (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [movimentacoes, definirMovimentacoes] = useState([]);
  const [tipoMovimentacao, setTipoMovimentacao] = useState("");
  const movimentacoesRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];

  movimentacoesRef.current = movimentacoes;

  const buscarVariaveisDePaginacao = (page, pageSize, tipo) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    if (tipo) {
      params["tipo"] = tipo;
    }

    return params;
  };

  const buscarMovimentacoes = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize);

    if (tipoMovimentacao) {
        // Se um tipo específico foi selecionado, use getTipos
        MovimentacoesDataService.getTipos({ ...params, tipo: tipoMovimentacao })
            .then(handleResponse)
            .catch(handleError);
    } else {
        // Se nenhum tipo foi selecionado, busque todas as movimentações
        MovimentacoesDataService.getAll(params)
            .then(handleResponse)
            .catch(handleError);
    }
  };

  const openMovimentacoes = (rowIndex) => {
    const id = movimentacoesRef.current[rowIndex].id;

    props.history.push("/Movimentacoes/" + id);
  };

  const deleteMovimentacoes = (rowIndex) => {
    const id = movimentacoesRef.current[rowIndex].id;

    MovimentacoesDataService.remove(id)
      .then((response) => {
        props.history.push("/Movimentacoes");

        let novasMovimentacoes= [...movimentacoesRef.current];
        novasMovimentacoes.splice(rowIndex, 1);

        definirMovimentacoes(novasMovimentacoes);
      })
      .catch((e) => {
        console.log(e);
      });
  };

    const handleResponse = (response) => {
      const movimentacoes = response.data.content;
      const totalPages = response.data.totalPages;

      definirMovimentacoes(movimentacoes);
      setCount(totalPages);
  };

  const handleError = (error) => {
      console.log(error);
  };

  useEffect(buscarMovimentacoes, [page, pageSize, tipoMovimentacao]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleTipoMovimentacaoChange = (event) => {
    const valor = event.target.value;

    // Transformar para maiúsculo e verificar se é "E" ou "S"
    const tipoValido = (valor === "E" || valor === "S") ? valor.toUpperCase() : "";

    setTipoMovimentacao(tipoValido);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "produtoId",
        accessor: "produto_id",
      },
      {
        Header: "quantidade",
        accessor: "quantidade",
      },
      {
        Header: "valor",
        accessor: "valor",
      },
      {
        Header: "tipo",
        accessor: "tipo",
      },
      {
        Header: "dataRegistro",
        accessor: "dataRegistro",
      },
      {
        Header: "fornecedorId",
        accessor: "fornecedor_id",
      },
      {
        Header: "Ações",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;

          return (
            <div>
              <span onClick={() => openMovimentacoes(rowIdx)}>
                <button type="button" className="btn btn-warning btn-sm">Editar produto</button>
              </span>
              &nbsp;
              <span onClick={() => deleteMovimentacoes(rowIdx)}>
                <button type="button" className="btn btn-danger btn-sm">Remover produto</button>
              </span>
              &nbsp;
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
    data: movimentacoes,
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

        <div>
          {"Tipo de Movimentação: "}
          <select onChange={handleTipoMovimentacaoChange} value={tipoMovimentacao}>
            <option value="">Todos</option>
            <option value="E">Entrada</option>
            <option value="S">Saída</option>
          </select>
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
            <button type="button" className="btn btn-success" onClick={() => props.history.push("/NovaMovimentacao")}>
            Adicionar Movimentacoes
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

export default ListaDeMovimentacoes;

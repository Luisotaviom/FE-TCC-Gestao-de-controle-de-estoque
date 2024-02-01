import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import RelatorioSemanalDataService from "../services/GerencyServiceMov";
import { useTable } from "react-table";
import styles from './css.module.css'; // Ajuste o caminho conforme necessário


const RelatorioSemanal = (props) => {
  /**
   * useState é um Hook do React que permite adicionar estado a componentes de função. 
   * Neste caso, useState([]) inicializa um estado chamado "users" com um valor inicial de um array vazio []. 
   * O array vazio é passado como um valor inicial para o estado.
   */
  const [relatorioSemanal, definirRelatorioSemanal] = useState([]);
  const [tipoRelatorio, setTipoRelatorio] = useState("");
  const relatorioSemanalRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];


  relatorioSemanalRef.current = relatorioSemanal;

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

const buscarRelatorioSemanal = () => {
  const params = buscarVariaveisDePaginacao(page, pageSize, tipoRelatorio);

  if (tipoRelatorio) { 
    RelatorioSemanalDataService.getRelatorioSemanal(params)
      .then(handleResponse)
      .catch(handleError);
  } else { 
    RelatorioSemanalDataService.getTiposRelatorios(params)
      .then(handleResponse)
      .catch(handleError);
  }
};

    const handleResponse = (response) => {
      const relatorioSemanal = response.data.content;
      const totalPages = response.data.totalPages;

      definirRelatorioSemanal(relatorioSemanal);
      setCount(totalPages);
  };

  const handleError = (error) => {
      console.log(error);
  };

  useEffect(buscarRelatorioSemanal, [page, pageSize, tipoRelatorio]);

  const handlePageChange = (event, value) => {
    setPage(parseInt(value, 10)); // Converte para número
  };

  const handleTipoMovimentacaoChange = (event) => {
    const valor = event.target.value;
    const tipoValido = (valor === "E" || valor === "S") ? valor.toUpperCase() : "";

    setTipoRelatorio(tipoValido);
  };
  

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };


  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Produto",
        accessor: row => `${row.produto_id} (${row.produtoNome})`,
        id: "produto", // Este é um identificador único para a coluna, necessário se você usa uma função para accessor
      },      
      {
        Header: "Quantidade",
        accessor: "quantidade",
      },
      {
        Header: "Valor",
        accessor: "valor",
        Cell: ({ value }) => `R$ ${value.toFixed(2).replace('.', ',')}`, // Adiciona R$ e formata o número
      },
      {
        Header: "Tipo",
        accessor: "tipo",
      },
      {
        Header: "Data de movimentação",
        accessor: "dataRegistro",
        Cell: ({ value }) => {
          // Verificar se value (dataRegistro) é válido
          if (!value) {
            return "Data não disponível"; // Ou qualquer texto que você queira exibir para datas inválidas
          }
          const date = new Date(value);
          const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).format(date);
          return formattedDate; // Retorna a data formatada, por exemplo "01/03/2021, 12:00:00"
        },
      },
      {
        Header: "Fornecedor",
        accessor: row => `${row.fornecedor_id} (${row.fornecedorNome})`,
        id: "fornecedor", // Este é um identificador único para a coluna, necessário se você usa uma função para accessor
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
    data: relatorioSemanal,
  });

  return (
    <div className={`${styles.list} row`}>
    <div className="col-md-12">
      <h2 className={styles.h2}>Lista de relatorioSemanal</h2>
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
            {"Tipo de relatorio: "}
            <select onChange={handleTipoMovimentacaoChange} value={tipoRelatorio}>
              <option value="">Todos</option>
              <option value="E">Entrada</option>
              <option value="S">Saída</option>
            </select>
          </div>
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

export default RelatorioSemanal;

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Pagination from "@material-ui/lab/Pagination";
import MovimentacoesDataService from "../services/GerencyServiceMov";
import { useTable } from "react-table";
import styles from './css.module.css'; // Ajuste o caminho conforme necessário


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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoriaMovimentacao, setCategoriaMovimentacao] = useState("");
  

  movimentacoesRef.current = movimentacoes;

const buscarVariaveisDePaginacao = (page, pageSize, tipo, categoria, dataRegistro) => {
  let params = {};

  if (page) {
    params["page"] = page - 1;
  }

  if (pageSize) {
    params["size"] = pageSize;
  }

  if (categoria) {
    params["categoria"] = categoria;
  }

  if (tipo) {
    params["tipo"] = tipo;
  }

  if (dataRegistro && dataRegistro.start && dataRegistro.end) {
    params["start"] = dataRegistro.start;
    params["end"] = dataRegistro.end;
  }

  return params;
};

  const buscarMovimentacoes = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize, tipoMovimentacao, categoriaMovimentacao, { start: startDate, end: endDate });
  
    if (tipoMovimentacao && startDate && endDate) {
      MovimentacoesDataService.getDataETipo(params)
        .then(handleResponse)
        .catch(handleError);
    }
    else if (tipoMovimentacao) {
      MovimentacoesDataService.getTipos(params)
        .then(handleResponse)
        .catch(handleError);
    }
    else if (categoriaMovimentacao) {
      MovimentacoesDataService.getCategoria(params)
        .then(handleResponse)
        .catch(handleError);
    }
    else if (startDate && endDate) {
      MovimentacoesDataService.getData(params)
        .then(handleResponse)
        .catch(handleError);
    }
    else {
      MovimentacoesDataService.getAll(params)
        .then(handleResponse)
        .catch(handleError);
    }
  };
  

  const openMovimentacoes = useCallback((rowIndex) => {
    const id = movimentacoesRef.current[rowIndex].id;
    props.history.push("/Movimentacoes/" + id);
  }, [props.history, movimentacoesRef]);

  const deleteMovimentacoes = useCallback((rowIndex) => {
    const id = movimentacoesRef.current[rowIndex].id;
    MovimentacoesDataService.remove(id)
      .then((response) => {
        props.history.push("/ListaDeMovimentacoes");
  
        let novasMovimentacoes = [...movimentacoesRef.current];
        novasMovimentacoes.splice(rowIndex, 1);
  
        definirMovimentacoes(novasMovimentacoes);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [props.history, movimentacoesRef]); 

    const handleResponse = (response) => {
      const movimentacoes = response.data.content;
      const totalPages = response.data.totalPages;

      definirMovimentacoes(movimentacoes);
      setCount(totalPages);
  };

  const handleError = (error) => {
      console.log(error);
  };

  useEffect(buscarMovimentacoes, [page, pageSize, tipoMovimentacao, categoriaMovimentacao]);

  const handlePageChange = (event, value) => {
    setPage(parseInt(value, 10)); // Converte para número
  };
  

  const handleCategoriaMovimentacaoChange = (event) => {
    const categoria = event.target.value;
    const categoriaValida = (categoria === "Gas" || categoria === "Agua") ? categoria.toUpperCase() : "";

    setCategoriaMovimentacao(categoriaValida);
  };

  const handleTipoMovimentacaoChange = (event) => {
    const valor = event.target.value;
    const tipoValido = (valor === "E" || valor === "S") ? valor.toUpperCase() : "";

    setTipoMovimentacao(tipoValido);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
      setEndDate(event.target.value);
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
        Header: "Categoria",
        accessor: "categoria",
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
      {
        Header: "Ações",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div className="action-buttons">
              <button type="button" className="btn btn-warning btn-sm" onClick={() => openMovimentacoes(rowIdx)}>
                Editar movimentação
              </button>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => deleteMovimentacoes(rowIdx)}>
                Excluir movimentação
              </button>
            </div>
          );
        },
      },
    ],
    [openMovimentacoes, deleteMovimentacoes] // Agora essas funções são estáveis e não mudarão a cada renderização
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
    <div className={`${styles.list} row`}>
    <div className="col-md-12">
      <h2 className={styles.h2}>Lista de movimentacoes</h2>
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
            {"Tipo de Movimentação: "}
            <select onChange={handleTipoMovimentacaoChange} value={tipoMovimentacao}>
              <option value="">Todos</option>
              <option value="E">Entrada</option>
              <option value="S">Saída</option>
            </select>
          </div>
          <div>
            {"Categoria: "}
            <select onChange={handleCategoriaMovimentacaoChange} value={categoriaMovimentacao}>
              <option value="">Todos</option>
              <option value="Gas">Gás</option>
              <option value="Agua">Água</option>
            </select>
          </div>
          <div>
          {"Buscar por data: "}
          <input
            type="datetime-local"
            name="startDate"
            value={startDate}
            onChange={handleStartDateChange}
          />
            <input
              type="datetime-local"
              name="endDate"
              value={endDate}
              onChange={handleEndDateChange}
            />
            <button onClick={buscarMovimentacoes}>Buscar</button>
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
          <div className="mt-3">
            <button type="button" className="btn btn-success" onClick={() => props.history.push("/NovaMovimentacao")}>
              Criar Movimentacoes
            </button>
            <button type="button" className="btn btn-primary" onClick={() => props.history.push("/RelatorioSemanal")}>
              Relatorio Semanal
            </button>
            <button type="button" className="btn btn-primary" onClick={() => props.history.push("/RelatorioMensal")}>
              Relatorio mensal
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

export default ListaDeMovimentacoes;

import React, { useState, useEffect, useRef, useCallback } from "react";
import Pagination from "@material-ui/lab/Pagination";
import MovimentacoesDataService from "../services/GerencyServiceMov";
import styles from '../CSS/listaMovimentacoes.module.css'; 


const ListaDeMovimentacoes = (props) => {

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

  useEffect(buscarMovimentacoes, [page, pageSize, tipoMovimentacao, categoriaMovimentacao, endDate, startDate]);

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

        <div className={styles.cardContainer}>
          {movimentacoes.map((movimentacao) => (
            <div key={movimentacao.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h5>Movimentação: {movimentacao.id}</h5>
              </div>
                <div className={styles.cardBody}>
                  <p>Produto: {`${movimentacao.produto_id} (${movimentacao.produtoNome})`}</p>
                  <p>Quantidade: {movimentacao.quantidade}</p>
                  <p>Valor: R$ {movimentacao.valor.toFixed(2).replace('.', ',')}</p>
                  <p>Tipo: {movimentacao.tipo === 'E' ? 'Entrada' : 'Saída'}</p>
                  <p>Categoria: {movimentacao.categoria}</p>
                  <p>Data de Movimentação: {new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }).format(new Date(movimentacao.dataRegistro))}</p>
                  <p>Fornecedor: {`${movimentacao.fornecedor_id} (${movimentacao.fornecedorNome})`}</p>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      className={styles.button_edit}
                      onClick={() => openMovimentacoes(movimentacao.id)}
                    >
                      Editar Movimentação
                    </button>
                    <button
                      type="button"
                      className={styles.button_delete}
                      onClick={() => deleteMovimentacoes(movimentacao.id)}
                    >
                      Excluir Movimentação
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
          className={`table ${styles.listTable}`}
        >
          <thead>
            {((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>


                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {((row, i) => {
              ;
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
            <button type="button" className={`${styles.button_add}`} onClick={() => props.history.push("/NovaMovimentacao")}>
              Criar Movimentacoes
            </button>
            <button type="button" className={`${styles.button_relatorios}`} onClick={() => props.history.push("/RelatorioSemanal")}>
              Relatorio Semanal
            </button>
            <button type="button" className={`${styles.button_relatorios}`} onClick={() => props.history.push("/RelatorioMensal")}>
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

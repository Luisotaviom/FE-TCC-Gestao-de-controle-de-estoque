import React, { useState, useEffect, useRef, useCallback } from "react";
import Pagination from "@material-ui/lab/Pagination";
import MovimentacoesDataService from "../services/GerencyServiceMov";
import styles from "../CSS/listaMovimentacoes.module.css";

const ListaDeMovimentacoes = (props) => {
  const [movimentacoes, definirMovimentacoes] = useState([]);
  const [tipoMovimentacao, setTipoMovimentacao] = useState("");
  const movimentacoesRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(3); // Defina o valor inicial como 3
  const pageSizes = [3, 6, 9, 12]; // Adicione as opções de itens por página desejadas
  const [categoriaMovimentacao, setCategoriaMovimentacao] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    buscarMovimentacoes();
  }, [page, pageSize, tipoMovimentacao, categoriaMovimentacao]);

  const buscarMovimentacoes = async () => {
    setIsLoading(true);
    const params = buscarVariaveisDePaginacao(
      page,
      pageSize,
      tipoMovimentacao,
      categoriaMovimentacao
    );

    try {
      let response;
      if (tipoMovimentacao || categoriaMovimentacao) {
        response = await MovimentacoesDataService.getTipoCategoria(params);
      } else {
        response = await MovimentacoesDataService.getAll(params);
      }

      definirMovimentacoes(response.data.content);
      setCount(Math.ceil(response.data.totalPages));
    } catch (error) {
      console.error("Erro ao buscar movimentações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buscarVariaveisDePaginacao = (page, pageSize, tipo, categoria) => {
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

    return params;
  };

  const openMovimentacoes = useCallback(
    (id) => {
      props.history.push("/Movimentacoes/" + id);
    },
    [props.history]
  );

  const deleteMovimentacoes = useCallback(
    (id) => {
      MovimentacoesDataService.remove(id)
        .then(() => {
          // Atualização: Agora estamos usando 'movimentacoes' diretamente ao invés de 'movimentacoesRef.current'
          const novasMovimentacoes = movimentacoes.filter(
            (movimentacao) => movimentacao.id !== id
          );
          definirMovimentacoes(novasMovimentacoes);
          // Redireciona após a operação de deleção, se necessário
          props.history.push("/ListaDeMovimentacoes");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // Atualização: Removido 'movimentacoesRef' das dependências, pois não é mais necessário
    [props.history, movimentacoes]
  );

  const handlePageChange = (event, value) => {
    setPage(parseInt(value, 10));
  };

  const handleCategoriaMovimentacaoChange = (event) => {
    const categoria = event.target.value;
    const categoriaFormatada =
      categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();

    setCategoriaMovimentacao(categoriaFormatada);
  };

  const handleTipoMovimentacaoChange = (event) => {
    const valor = event.target.value;
    const tipoValido =
      valor === "E" || valor === "S" ? valor.toUpperCase() : "";

    setTipoMovimentacao(tipoValido);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  return (
    <div className={`${styles.list} row`}>
      <div className="col-md-12">
        <h2 className={styles.h2}>Lista de movimentacoes</h2>
        <div className="d-flex justify-content-between mt-3">
          <div>
            {"Tipo de Movimentação: "}
            <select
              onChange={handleTipoMovimentacaoChange}
              value={tipoMovimentacao}
            >
              <option value="">Todos</option>
              <option value="E">Entrada</option>
              <option value="S">Saída</option>
            </select>
          </div>
          <div>
            {"Categoria: "}
            <select
              onChange={handleCategoriaMovimentacaoChange}
              value={categoriaMovimentacao}
            >
              <option value="">Todos</option>
              <option value="Gas">Gás</option>
              <option value="Agua">Água</option>
            </select>
          </div>
        </div>

        <div className={styles.cardContainer}>
          {movimentacoes.map((movimentacao) => (
            <div key={movimentacao.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h5>Movimentação: {movimentacao.id}</h5>
              </div>
              <div className={styles.cardBody}>
                <p>
                  Produto:{" "}
                  {`${movimentacao.produto_id} (${movimentacao.produtoNome})`}
                </p>
                <p>Quantidade: {movimentacao.quantidade}</p>
                <p>
                  Valor: R$ {movimentacao.valor.toFixed(2).replace(".", ",")}
                </p>
                <p>Tipo: {movimentacao.tipo === "E" ? "Entrada" : "Saída"}</p>
                <p>Categoria: {movimentacao.categoria}</p>
                <p>
                  Data de Movimentação:{" "}
                  {new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(new Date(movimentacao.dataRegistro))}
                </p>
                <p>
                  Fornecedor:{" "}
                  {`${movimentacao.fornecedor_id} (${movimentacao.fornecedorNome})`}
                </p>
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
      </div>

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
          <button
            type="button"
            className={`${styles.button_add}`}
            onClick={() => props.history.push("/NovaMovimentacao")}
          >
            Criar Movimentacoes
          </button>
          <button
            type="button"
            className={`${styles.button_relatorios}`}
            onClick={() => props.history.push("/RelatorioSemanal")}
          >
            Relatorio Semanal
          </button>
          <button
            type="button"
            className={`${styles.button_relatorios}`}
            onClick={() => props.history.push("/RelatorioMensal")}
          >
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

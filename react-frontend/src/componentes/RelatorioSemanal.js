import React, { useState, useEffect, useMemo, useRef } from "react";
import RelatorioSemanalDataService from "../services/GerencyServiceMov";
import { useTable } from "react-table";
import Select from "react-select";

const RelatorioSemanal = (props) => {
  const [relatorioSemanal, definirRelatorioSemanal] = useState([]);
  const [tipoRelatorio] = useState("");
  const relatorioSemanalRef = useRef();
  const [selectedOptions, setSelectedOptions] = useState([]);

  relatorioSemanalRef.current = relatorioSemanal;

  const buscarRelatorioSemanal = () => {
    const tipos = selectedOptions
      .filter((option) => option.value.startsWith("tipo-"))
      .map((option) => option.value.replace("tipo-", ""));

    const categorias = selectedOptions
      .filter((option) => option.value.startsWith("categoria-"))
      .map((option) => option.value.replace("categoria-", ""));

    const params = new URLSearchParams();
    if (tipos.length > 0) {
      params.append("tipo", tipos[0]); // Supondo que só pode haver um tipo
    }
    if (categorias.length > 0) {
      params.append("categoria", categorias[0]); // Supondo que só pode haver uma categoria
    }

    definirRelatorioSemanal([]);

    RelatorioSemanalDataService.getRelatorioSemanal(params.toString())
      .then(handleResponse)
      .catch(handleError);
  };

  const handleResponse = (response) => {
    let data =
      response.data && response.data.content ? response.data.content : [];
    // Filtro aplicado aqui...
    if (selectedOptions.length > 0) {
      data = data.filter((item) => {
        // Assume que 'tipo' é 'E' ou 'S' e 'categoria' é o nome da categoria sem prefixo.
        const tipoFiltros = selectedOptions
          .filter((option) => option.value.startsWith("tipo-"))
          .map((option) => option.value.replace("tipo-", ""));
        const categoriaFiltros = selectedOptions
          .filter((option) => option.value.startsWith("categoria-"))
          .map((option) => option.value.replace("categoria-", ""));

        const correspondeAoTipo =
          tipoFiltros.length === 0 || tipoFiltros.includes(item.tipo);
        const correspondeACategoria =
          categoriaFiltros.length === 0 ||
          categoriaFiltros.includes(item.categoria);

        return correspondeAoTipo && correspondeACategoria;
      });
    }
    definirRelatorioSemanal(data);
  };

  const handleError = (error) => {
    console.error("Erro ao buscar relatório semanal:", error);
    if (error.response) {
      console.error("Dados da resposta:", error.response.data);
      console.error("Status da resposta:", error.response.status);
      console.error("Cabeçalhos da resposta:", error.response.headers);
    } else if (error.request) {
      console.error("Requisição feita, sem resposta:", error.request);
    } else {
      console.error("Erro:", error.message);
    }
  };

  useEffect(buscarRelatorioSemanal, [selectedOptions]);

  const options = [
    { value: "tipo-E", label: "Tipo: Entrada" },
    { value: "tipo-S", label: "Tipo: Saída" },
    { value: "categoria-Gas", label: "Categoria: Gás" },
    { value: "categoria-Agua", label: "Categoria: Água" },
  ];

  const handleChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const cellStyle = {
    border: "2px solid black",
    padding: "8px",
    textAlign: "left",
  };

  const headerCellStyle = {
    ...cellStyle,
    backgroundColor: "#f2f2f2",
  };

  const totais = relatorioSemanal.reduce(
    (acc, item) => {
      const quantidade = Number(item.quantidade);
      const valor = Number(item.valor);

      // Se estiver visualizando todos os tipos, calcula a diferença
      if (tipoRelatorio === "") {
        if (item.tipo === "E") {
          // Entrada
          acc.totalQuantidade += quantidade; // Aumenta a quantidade
          acc.totalValor -= valor; // Soma ao valor
        } else if (item.tipo === "S") {
          // Saída
          acc.totalQuantidade -= quantidade; // Diminui a quantidade
          acc.totalValor += valor; // Subtrai do valor
        }
      }
      // Se estiver visualizando apenas entradas ou apenas saídas, soma os valores
      else {
        if (item.tipo === tipoRelatorio) {
          acc.totalQuantidade += quantidade; // Aumenta a quantidade para 'E' ou diminui para 'S'
          // Ajusta o valor baseado no tipo
          acc.totalValor += item.tipo === "E" ? valor : -valor;
        }
      }

      return acc;
    },
    { totalQuantidade: 0, totalValor: 0 }
  );

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Produto",
        accessor: (row) => `${row.produto_id} (${row.produtoNome})`,
        id: "produto", // Este é um identificador único para a coluna, necessário se você usa uma função para accessor
      },
      {
        Header: "Quantidade",
        accessor: "quantidade",
      },
      {
        Header: "Valor",
        accessor: "valor",
        Cell: ({ value }) => `R$ ${value.toFixed(2).replace(".", ",")}`, // Adiciona R$ e formata o número
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
          const formattedDate = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(date);
          return formattedDate; // Retorna a data formatada, por exemplo "01/03/2021, 12:00:00"
        },
      },
      {
        Header: "Fornecedor",
        accessor: (row) => `${row.fornecedor_id} (${row.fornecedorNome})`,
        id: "fornecedor", // Este é um identificador único para a coluna, necessário se você usa uma função para accessor
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: relatorioSemanal,
    });

  return (
    <div className="row">
      <div className="col-md-12">
        <h2>Relatorio Semanal</h2>
        <div className="d-flex justify-content-between mt-3">
          <div className="filter-section">
            <Select
              isMulti
              name="filtros"
              options={options}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleChange}
              value={selectedOptions}
              placeholder="Selecione tipos ou categorias..."
            />
          </div>
        </div>
      </div>

      <table {...getTableProps()} style={tableStyle}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} style={headerCellStyle}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={cellStyle}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
          <tr>
            <td colSpan="2" style={cellStyle}>
              Total de produtos:
            </td>
            <td style={cellStyle}>{totais.totalQuantidade}</td>
            <td style={cellStyle}>{`R$ ${totais.totalValor
              .toFixed(2)
              .replace(".", ",")}`}</td>
            <td colSpan="3" style={cellStyle}></td>
          </tr>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => props.history.push("/RelatorioMensal")}
          >
            Relatorio Mensal
          </button>
        </tbody>
      </table>
    </div>
  );
};

export default RelatorioSemanal;

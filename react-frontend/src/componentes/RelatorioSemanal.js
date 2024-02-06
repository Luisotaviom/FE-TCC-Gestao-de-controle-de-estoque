import React, { useState, useEffect, useMemo, useRef } from "react";
import RelatorioSemanalDataService from "../services/GerencyServiceMov";
import { useTable } from "react-table";


const RelatorioSemanal = (props) => {
  const [relatorioSemanal, definirRelatorioSemanal] = useState([]);
  const [tipoRelatorio, setTipoRelatorio] = useState("");
  const [categoriaRelatorio, setCategoriaRelatorio] = useState("");
  const relatorioSemanalRef = useRef();

  relatorioSemanalRef.current = relatorioSemanal;

  const buscarRelatorioSemanal = () => {
    const params = {};
    if (tipoRelatorio) {
      params.tipo = tipoRelatorio;
    }
    if (categoriaRelatorio) {
      params.categoria = categoriaRelatorio;
    }
  
    definirRelatorioSemanal([]);
  
    RelatorioSemanalDataService.getRelatorioSemanal(params)
      .then(handleResponse)
      .catch(handleError);
  };
  
  
  const handleResponse = (response) => {
    if (response.data && response.data.content) {
      definirRelatorioSemanal(response.data.content);
    } else {
      definirRelatorioSemanal([]);
    }
  };
  
  const handleError = (error) => {
    console.error('Erro ao buscar relatório semanal:', error);
  };
  
  useEffect(buscarRelatorioSemanal, [tipoRelatorio, categoriaRelatorio]);
  

  const handleTipoMovimentacaoChange = (event) => {
    setTipoRelatorio(event.target.value);
  };
  
  const handleCategoriaMovimentacaoChange = (event) => {
    setCategoriaRelatorio(event.target.value);
  };
  

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };
  
  const cellStyle = {
    border: '2px solid black',
    padding: '8px',
    textAlign: 'left',
  };
  
  const headerCellStyle = {
    ...cellStyle,
    backgroundColor: '#f2f2f2',
  };

  const totais = relatorioSemanal.reduce((acc, item) => {
    const quantidade = Number(item.quantidade);
    const valor = Number(item.valor);
    
    // Se estiver visualizando todos os tipos, calcula a diferença
    if (tipoRelatorio === "") {
      if (item.tipo === 'E') {
        acc.totalQuantidade += quantidade;
        acc.totalValor -= valor;
      } else if (item.tipo === 'S') {
        acc.totalQuantidade -= quantidade;
        acc.totalValor += valor;
      }
    }
    // Se estiver visualizando apenas entradas ou apenas saídas, soma os valores
    else {
      if (item.tipo === tipoRelatorio) {
        acc.totalQuantidade += quantidade;
        acc.totalValor += valor;
      }
    }
    
    return acc;
}, { totalQuantidade: 0, totalValor: 0 });

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
    <div className="row">
      <div className="col-md-12">
        <h2>Relatorio Semanal</h2>
        <div className="d-flex justify-content-between mt-3">
          <div>
            {"Tipo: "}
            <select onChange={handleTipoMovimentacaoChange} value={tipoRelatorio}>
              <option value="">Todos</option>
              <option value="E">Entrada</option>
              <option value="S">Saída</option>
            </select>
          </div>
          <div>
            {"Categoria: "}
            <select onChange={handleCategoriaMovimentacaoChange} value={categoriaRelatorio}>
              <option value="">Todos</option>
              <option value="Gás">Gás</option>
              <option value="Água">Água</option>
            </select>
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
            <td colSpan="2" style={cellStyle}>Total de produtos:</td>
            <td style={cellStyle}>{totais.totalQuantidade}</td>
            <td style={cellStyle}>{`R$ ${totais.totalValor.toFixed(2).replace('.', ',')}`}</td>
            <td colSpan="3" style={cellStyle}></td>
          </tr>
          <button type="button" className="btn btn-primary" onClick={() => props.history.push("/RelatorioMensal")}>
              Relatorio Mensal
            </button>
        </tbody>
      </table>
      </div>
  );
};

export default RelatorioSemanal;

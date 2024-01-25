import React, { useState, useEffect } from 'react';

const Report = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    // Substitua 'your-backend-endpoint' com o endpoint real do seu backend
    fetch('your-backend-endpoint')
      .then(response => response.json())
      .then(data => {
        // Supondo que o backend retorna uma array de objetos
        setReportData(data);
      })
      .catch(error => {
        console.error('Erro ao buscar os dados:', error);
      });
  }, []);

  return (
    <div>
      <h1>Relatório de Vendas</h1>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor</th>
            {/* Adicione mais cabeçalhos de colunas conforme necessário */}
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => (
            <tr key={index}>
              <td>{item.produtoNome}</td>
              <td>{item.quantidade}</td>
              <td>R$ {item.valor.toFixed(2)}</td>
              {/* Adicione mais células de dados conforme necessário */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const Graficos = () => {
  const [movimentacoes, setMovimentacoes] = useState([]);
  let isMounted = true;

  useEffect(() => {
    const buscarMovimentacoes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Movimentacoes/relatorio/mensal');
        if (isMounted) {
          const data = response.data.content;
          const sortedData = data.sort((a, b) => new Date(a.dataRegistro) - new Date(b.dataRegistro));
          setMovimentacoes(sortedData);
        }
      } catch (error) {
        console.error('Houve um erro ao buscar as movimentações:', error);
      }
    };

    buscarMovimentacoes();
    return () => {
      isMounted = false;
    };
  }, []);

  const processarValoresDiarios = () => {
    // Prepara um array para cada dia do mês atual, inicializando com uma lista vazia para entradas e saídas
    const currentMonthDays = eachDayOfInterval({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date())
    }).map(day => format(day, 'yyyy-MM-dd'));

    const valoresEntradas = [];
    const valoresSaidas = [];

    currentMonthDays.forEach(day => {
      movimentacoes.forEach((mov, index) => {
        const movDate = format(new Date(mov.dataRegistro), 'yyyy-MM-dd');
        if (movDate === day) {
          const valor = parseFloat(mov.valor);
          if (mov.tipo === 'E') {
            valoresEntradas.push({ x: day, y: valor, group: index });
          } else if (mov.tipo === 'S') {
            valoresSaidas.push({ x: day, y: valor, group: index }); // Usamos valores negativos para saídas para distingui-los no gráfico
          }
        }
      });
    });

    return { valoresEntradas, valoresSaidas };
  };

  const processarQuantidadesProdutos = () => {
    const quantidadesEntradas = movimentacoes
      .filter(mov => mov.tipo === 'E')
      .map(mov => ({
        x: format(new Date(mov.dataRegistro), 'yyyy-MM-dd'),
        y: mov.quantidade,
      }));

    const quantidadesSaidas = movimentacoes
      .filter(mov => mov.tipo === 'S')
      .map(mov => ({
        x: format(new Date(mov.dataRegistro), 'yyyy-MM-dd'),
        y: -mov.quantidade, 
      }));

    return { quantidadesEntradas, quantidadesSaidas };
  };

  const { quantidadesEntradas, quantidadesSaidas } = processarQuantidadesProdutos();


  const { valoresEntradas, valoresSaidas } = processarValoresDiarios();

  const dadosGrafico = {
    datasets: [
      {
        label: 'Entrada',
        data: valoresEntradas,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Saída',
        data: valoresSaidas,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const dadosGraficoQuantidades = {
    datasets: [
      {
        label: 'Entrada',
        data: quantidadesEntradas,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Saida',
        data: quantidadesSaidas,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const opcoesGrafico = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'dd-MM-yyyy',
          displayFormats: {
            day: 'dd-MM-yyyy',
          },
        },
        title: {
          display: true,
          text: 'Data',
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Valor de Produtos Movimentados Mensalmente',
      },
      tooltip: {
        titleFont: {
          weight: 'normal', 
        },
        bodyFont: {
          weight: 'normal',
        },
        footerFont: {
          weight: 'normal', 
        },
        callbacks: {
          beforeTitle: function(context) {
            const pointIndex = context[0].dataIndex;
            const datasetIndex = context[0].datasetIndex;
  
            const movimentacao = movimentacoes[pointIndex];
            if (!movimentacao) return '';
  
            return `Produto: ${movimentacao.produtoNome}\n\nFornecedor: ${movimentacao.fornecedorNome}\n`;
          },
          label: function(context) {
            // context contém todas as informações sobre o ponto de dados, incluindo o valor
            let label = context.dataset.label || '';
  
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += `R$: ${context.parsed.y}`;
            }
            return label;
          }
        }
      }
    }
  };

  const opcoesGraficoQuantidades = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade',
        },
      },
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'dd-MM-yyyy',
          displayFormats: {
            day: 'dd-MM-yyyy',
          },
        },
        title: {
          display: true,
          text: 'Data',
        },
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Quantidades de Produtos Movimentados Mensalmente',
      },
      tooltip: {
        titleFont: {
          weight: 'normal', 
        },
        bodyFont: {
          weight: 'normal', 
        },
        footerFont: {
          weight: 'normal', 
        },
        callbacks: {
          beforeTitle: function(context) {
            const pointIndex = context[0].dataIndex;
            const datasetIndex = context[0].datasetIndex;
  
            const movimentacao = movimentacoes[pointIndex];
            if (!movimentacao) return '';
  
            return `Produto: ${movimentacao.produtoNome}\n\nFornecedor: ${movimentacao.fornecedorNome}\n`;
          }
        }
      }
    },
  };

  return (
    <div>
      <h1>Movimentações valores</h1>
      <div style={{ height: '500px', width: '100%' }}>
        <Line data={dadosGrafico} options={opcoesGrafico} />
      </div>

      <h1>Movimentações quantidade</h1>
      <div style={{ height: '500px', width: '100%' }}>
        <Line data={dadosGraficoQuantidades} options={opcoesGraficoQuantidades} />
      </div>
    </div>
  );

  
};

export default Graficos;

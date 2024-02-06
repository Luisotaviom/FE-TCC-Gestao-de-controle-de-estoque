import React from 'react';
import { Line } from 'react-chartjs-2';
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
  import 'chartjs-adapter-date-fns'; // Importar o adaptador de data necessário para a escala de tempo
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale, // Registrar a TimeScale aqui
    Title,
    Tooltip,
    Legend
  );
  
  
  // ... o restante do seu código para criar o gráfico
  

const GraficoMovimentacoes = ({ movimentacoes }) => {
    const dadosGrafico = {
        labels: movimentacoes.map(mov => new Date(mov.dataRegistro).toLocaleDateString()),
        datasets: [
          {
            label: 'Valor das Movimentações',
            data: movimentacoes.map(mov => mov.valor),
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            tension: 0.1,
          },
        ],
      };
      

  

      const opcoesGrafico = {
        scales: {
          y: {
            beginAtZero: true,
            // Você pode adicionar 'suggestedMax' se souber que seus valores são altos
            suggestedMax: 1000, // Ajuste este valor conforme necessário
          },
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'll',
            },
          },
        },
        maintainAspectRatio: false,
      };
      
  
  

  return <Line data={dadosGrafico} options={opcoesGrafico} />;
};

export default GraficoMovimentacoes;

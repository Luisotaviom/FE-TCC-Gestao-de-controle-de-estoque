import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Importe o componente Line aqui
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
        const response = await axios.get('http://localhost:8080/Movimentacoes');
        console.log(response.data); // Isso deve mostrar os dados recebidos no console
        if (isMounted) {
          setMovimentacoes(response.data.content);
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
  

  // Defina dadosGrafico e opcoesGrafico aqui
  const dadosGrafico = {
    labels: movimentacoes.map(mov => new Date(mov.dataRegistro).toISOString().slice(0, 10)),
    datasets: [
      {
        label: 'Quantidade das Movimentações',
        data: movimentacoes.map(mov => parseFloat(mov.quantidade)), // Garanta que são valores numéricos
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.1,
      },
    ],
  };

  const dadosGrafico2 = {
    labels: movimentacoes.map(mov => new Date(mov.dataRegistro).toISOString().slice(0, 10)),
    datasets: [
      {
        label: 'Valor das Movimentações',
        data: movimentacoes.map(mov => parseFloat(mov.valor)), 
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
      suggestedMax: Math.max(...movimentacoes.map(mov => parseFloat(mov.quantidade))) + 100,
    },
    x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'yyyy-MM-dd', 
          displayFormats: {
            day: 'yyyy-MM-dd',
          },
      },
      title: {
        display: true,
        text: 'Data',
      },
    },
  },
  maintainAspectRatio: false,
};

const opcoesGrafico2 = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...movimentacoes.map(mov => parseFloat(mov.valor))) + 100, 
      },
      x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'yyyy-MM-dd', 
            displayFormats: {
              day: 'yyyy-MM-dd',
            },
        },
        title: {
          display: true,
          text: 'Data',
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div>
      <h1>Quantidade de movimentações</h1>
      <div style={{ height: '500px', width: '100%' }}>
        <Line data={dadosGrafico} options={opcoesGrafico} />
      </div>
      <h1>Valor de movimentações</h1>
      <div style={{ height: '500px', width: '100%' }}>
        <Line data={dadosGrafico2} options={opcoesGrafico2} />
      </div>
    </div>
    
  );
};

export default Graficos;

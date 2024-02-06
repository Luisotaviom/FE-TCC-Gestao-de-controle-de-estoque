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
  
    // Extrair datas e valores das entradas e saídas
    const datasEntradas = movimentacoes
      .filter(mov => mov.tipo === 'E')
      .map(mov => new Date(mov.dataRegistro).toISOString().slice(0, 10));
  
    const valoresEntradas = movimentacoes
      .filter(mov => mov.tipo === 'E')
      .map(mov => parseFloat(mov.valor));
  
    const datasSaidas = movimentacoes
      .filter(mov => mov.tipo === 'S')
      .map(mov => new Date(mov.dataRegistro).toISOString().slice(0, 10));
  
    const valoresSaidas = movimentacoes
      .filter(mov => mov.tipo === 'S')
      .map(mov => parseFloat(mov.valor));
  
    // Defina os datasets para entradas e saídas
    const dadosGrafico = {
      labels: datasEntradas, // Usar datas de entradas ou saídas (depende do que você quer mostrar)
      datasets: [
        {
          label: 'Entradas',
          data: valoresEntradas,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          tension: 0.1,
        },
        {
          label: 'Saídas',
          data: valoresSaidas,
          fill: false,
          borderColor: 'rgba(255,99,132,1)', // Cor diferente para as saídas
          backgroundColor: 'rgba(255,99,132,0.2)',
          tension: 0.1,
        },
      ],
    };
  
    const opcoesGrafico = {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: Math.max(...valoresEntradas, ...valoresSaidas) + 100, // Ajuste a escala y
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
        <h1>Movimentações</h1>
        <div style={{ height: '500px', width: '100%' }}>
          <Line data={dadosGrafico} options={opcoesGrafico} />
        </div>
      </div>
    );
  };
  
  export default Graficos;
  
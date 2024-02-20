import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faWarehouse, faTruckMoving, faList, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';


const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Sistema de Controle de Estoque</h1>
      </header>

      <main className={styles.mainContent}>
        <p className={styles.introText}>
          Gerencie eficientemente seu estoque, fornecedores e produtos.
        </p>
        
        <div className={styles.navigation}>
          <h2>Navegação Rápida:</h2>
          <div className={styles.cardContainer}>
            <Link className={styles.card} to="/NovoFornecedor">
              <FontAwesomeIcon icon={faTruckMoving} /> Criar Fornecedores
            </Link>
            <Link className={styles.card} to="/NovaMovimentacao">
              <FontAwesomeIcon icon={faWarehouse} /> Criar Movimentações
            </Link>
            <Link className={styles.card} to="/ListaDeProdutos">
              <FontAwesomeIcon icon={faList} /> Lista de Produtos
            </Link>
            <Link className={styles.card} to="/ListaDeFornecedores">
              <FontAwesomeIcon icon={faList} /> Lista de Fornecedores
            </Link>
            <Link className={styles.card} to="/ListaDeMovimentacoes">
              <FontAwesomeIcon icon={faList} /> Lista de Movimentações
            </Link>
            <Link className={styles.card} to="/ListaDeFornecedores">
              <FontAwesomeIcon icon={faShoppingBasket} /> Criar Produto
            </Link>
            <Link className={styles.card} to="/RelatorioSemanal">
              <FontAwesomeIcon icon="fa-solid fa-file" />  Relatorio semanal
              </Link>
            <Link className={styles.card} to="/RelatorioMensal">
              <FontAwesomeIcon icon="fa-solid fa-file" />  Relatorio mensal
            </Link>
            <Link className={styles.card} to="/Graficos">
              <FontAwesomeIcon icon="fa-solid fa-chart-line" /> Graficos        
            </Link>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2024 Controle de Estoque</p>
      </footer>
    </div>
  );
};

export default WelcomePage;

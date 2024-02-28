import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../CSS/WelcomePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faWarehouse, faTruckMoving, faList, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faFile, faChartLine } from '@fortawesome/free-solid-svg-icons';




const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Controlex</h1>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.navigation}>
          <h2>Navegação Rápida:</h2>
          <div className={styles.cardContainer}>
            <Link className={styles.card} to="/NovoFornecedor">
              <FontAwesomeIcon icon={faTruckMoving} />Novo Fornecedores
            </Link>
            <Link className={styles.card} to="/NovaMovimentacao">
              <FontAwesomeIcon icon={faWarehouse} />Nova Movimentações
            </Link>
            <Link className={styles.card} to="/ListaDeProdutos">
              <FontAwesomeIcon icon={faList} />Produtos
            </Link>
            <Link className={styles.card} to="/ListaDeFornecedores">
              <FontAwesomeIcon icon={faList} />Fornecedores
            </Link>
            <Link className={styles.card} to="/ListaDeMovimentacoes">
              <FontAwesomeIcon icon={faList} />Movimentações
            </Link>
            <Link className={styles.card} to="/NovoProduto">
              <FontAwesomeIcon icon={faShoppingBasket} />Novo Produto
            </Link>
            <Link className={styles.card} to="/RelatorioSemanal">
              <FontAwesomeIcon icon={faFile} />Relatorio semanal
              </Link>
            <Link className={styles.card} to="/RelatorioMensal">
              <FontAwesomeIcon icon={faFile} />Relatorio mensal
            </Link>
            <Link className={styles.card} to="/Graficos">
              <FontAwesomeIcon icon={faChartLine} />Dashboards        
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

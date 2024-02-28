import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../CSS/NavBar.css';

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
 

  const togglePinSidebar = () => {
    setIsSidebarPinned(!isSidebarPinned);
    setIsSidebarOpen(!isSidebarPinned);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="pin-sidebar" onClick={togglePinSidebar}>
        <FontAwesomeIcon className="icon" icon="fa-solid fa-bars" />
      </div>
      <div className="sidebar-links">
        <Link to="/WelcomePage">Home</Link>
        <Link to="/ListaDeProdutos">Produtos</Link>
        <Link to="/ListaDeFornecedores">Fornecedores</Link>
        <Link to="/ListaDeMovimentacoes">Movimentacoes</Link>
        <Link to="/Graficos">Dashboards</Link>
      </div>

    </div>
  );
};

export default NavBar;

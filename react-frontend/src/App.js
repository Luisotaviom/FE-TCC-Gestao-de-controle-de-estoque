import React from "react"; // biblioteca principal
import { Switch, Route, Link } from "react-router-dom"; // roteamento
import "bootstrap/dist/css/bootstrap.min.css"; // importa bootstrap como estilo 
import "./App.css"; // importa estilo do projeto
import "@fortawesome/fontawesome-free/css/all.css"; // importa FA
import "@fortawesome/fontawesome-free/js/all.js"; // importa FA

//componentes livros
import ListaDeProdutos from "./componentes/ListaProdutos";
import Produtos from "./componentes/Produtos";
import CriarProduto from "./componentes/NovoProduto";


//componentes bibliotecas
import ListaDeFornecedores from "./componentes/ListaFornecedores";
import Fornecedores from "./componentes/Fornecedores";
import NovoFornecedor from "./componentes/NovoFornecedor";


//componentes BibliotecaGerency
import ListaDeBibliotecaGerency from "./componentes/ListaBibliotecaGerency";
import ListaProdutosDoFornecedor from "./componentes/ListaProdutosDoFornecedor";



function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <a href="/Fornecedores" className="navbar-brand">
          Estoque
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/Produtos"} className="nav-link">
            Produtos
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/Fornecedores"} className="nav-link">
            Fornecedores
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/BibliotecaGerency"} className="nav-link">
              Gerencia
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-6">
        <Switch>
          <Route exact path={["/", "/Produtos"]} component={ListaDeProdutos} />
          <Route exact path={["/", "/Fornecedores"]} component={ListaDeFornecedores} />
          <Route exact path={["/", "/BibliotecaGerency"]} component={ListaDeBibliotecaGerency} />
          <Route exact path={["/", "/Produtos/fornecedor/:fornecedor_id"]} component={ListaProdutosDoFornecedor} />          

          <Route exact path="/NovoFornecedor" component={NovoFornecedor} />
          <Route path="/Produtos/fornecedor/:id/produto" component={CriarProduto} />

          <Route path="/Produtos/:id" component={Produtos} />
          <Route path="/Fornecedores/:id" component={Fornecedores} />      
        </Switch>
      </div>
    </div>
    
  );
}

export default App;

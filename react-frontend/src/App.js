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
import Gerency from "./componentes/ListaProdutosDoFornecedor";
import CriarVinculo from "./componentes/Vinculo";



function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <a href="/Fornecedores" className="navbar-brand">
          Programação III
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/Produtos"} className="nav-link">
              Livros
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/Fornecedores"} className="nav-link">
              Biblioteca
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/BibliotecaGerency"} className="nav-link">
              Biblioteca Gerencia
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-6">
        <Switch>
          <Route exact path={["/", "/Produtos"]} component={ListaDeProdutos} />
          <Route exact path={["/", "/Fornecedores"]} component={ListaDeFornecedores} />
          <Route exact path={["/", "/BibliotecaGerency"]} component={ListaDeBibliotecaGerency} />
          <Route exact path={["/", "/Gerency/ListaProdutosDoFornecedor/:id"]} component={Gerency} />          

          <Route path="/Produtos/:id" component={Produtos} />
          <Route path="/Fornecedores/:id" component={Fornecedores} />      

          <Route exact path="/NovoFornecedor" component={NovoFornecedor} />
          <Route exact path="/NovoProduto" component={CriarProduto} />
          <Route exact path="/Vinculo" component={CriarVinculo} />
        </Switch>
      </div>
    </div>
    
  );
}

export default App;

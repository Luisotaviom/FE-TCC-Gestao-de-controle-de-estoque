import React from "react"; // biblioteca principal
import { Switch, Route, Link } from "react-router-dom"; // roteamento
import "bootstrap/dist/css/bootstrap.min.css"; // importa bootstrap como estilo 
import "./App.css"; // importa estilo do projeto
import "@fortawesome/fontawesome-free/css/all.css"; // importa FA
import "@fortawesome/fontawesome-free/js/all.js"; // importa FA

//componentes Produtos
import ListaDeProdutos from "./componentes/ListaProdutos";
import Produtos from "./componentes/Produtos";
import CriarProduto from "./componentes/NovoProduto";


//componentes Fornecedores
import ListaDeFornecedores from "./componentes/ListaFornecedores";
import Fornecedores from "./componentes/Fornecedores";
import NovoFornecedor from "./componentes/NovoFornecedor";
import ListaProdutosDoFornecedor from "./componentes/ListaProdutosDoFornecedor";


//componentes Movimentações
import ListaDeMovimentacoes from "./componentes/ListaMovimentacoes";
import NovaMovimentacao from "./componentes/NovaMovimentacao";
import Movimentacoes from "./componentes/Movimentacoes";





function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <a href="/Fornecedores" className="navbar-brand">
          Estoque
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/ListaDeProdutos"} className="nav-link">
            Produtos
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/ListaDeFornecedores"} className="nav-link">
            Fornecedores
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/ListaDeMovimentacoes"} className="nav-link">
              Movimentacoes
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-6">
        <Switch>
          <Route exact path={["/", "/ListaDeProdutos"]} component={ListaDeProdutos} />
          <Route exact path={["/", "/ListaDeFornecedores"]} component={ListaDeFornecedores} />
          <Route exact path={["/", "/ListaDeMovimentacoes"]} component={ListaDeMovimentacoes} />
          <Route exact path={["/", "/Produtos/fornecedor/:fornecedor_id"]} component={ListaProdutosDoFornecedor} />          

          <Route exact path="/NovoFornecedor" component={NovoFornecedor} />
          <Route path="/Produtos/fornecedor/:id/produto" component={CriarProduto} />
          <Route exact path="/NovaMovimentacao" component={NovaMovimentacao} />

          <Route path="/Produtos/:id" component={Produtos} />
          <Route path="/Fornecedores/:id" component={Fornecedores} />      
          <Route path="/Movimentacoes/:id" component={Movimentacoes} />      
        </Switch>
      </div>
    </div>
     
  );
}

export default App;

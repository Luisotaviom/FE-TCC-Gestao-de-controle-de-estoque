import React from "react"; // biblioteca principal
import { Switch, Route, useLocation } from "react-router-dom"; // roteamento
import "bootstrap/dist/css/bootstrap.min.css"; // importa bootstrap como estilo 
import "./App.css"; // importa estilo do projeto
import "@fortawesome/fontawesome-free/css/all.css"; // importa FA
import "@fortawesome/fontawesome-free/js/all.js"; // importa FA
import { AuthProvider } from "./contexts/AuthContext";
import NavBar from './componentes/NavBar'; // Importe o novo componente NavBar



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
import RelatorioSemanal from "./componentes/RelatorioSemanal";
import RelatorioMensal from "./componentes/RelatorioMensal";


//componentes welcome
import WelcomePage from "./componentes/WelcomePage";

//componentes graficos
import Graficos from "./componentes/Graficos";

//componentes autenticação
import LoginPage from "./componentes/LoginPage";


function App() {
  const location = useLocation(); 

  const shouldShowNavBar = location.pathname !== "/LoginPage" && location.pathname !== "/";

  return (
    <AuthProvider>
        {shouldShowNavBar && <NavBar />}
      
      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/ListaDeProdutos"]} component={ListaDeProdutos} />
          <Route exact path={["/", "/ListaDeFornecedores"]} component={ListaDeFornecedores} />
          <Route exact path={["/", "/ListaDeMovimentacoes"]} component={ListaDeMovimentacoes} />
          <Route exact path={["/", "/RelatorioMensal"]} component={RelatorioMensal} />
          <Route exact path={["/", "/RelatorioSemanal"]} component={RelatorioSemanal} />
          <Route exact path={["/", "/Produtos/fornecedor/:fornecedor_id"]} component={ListaProdutosDoFornecedor} /> 
          <Route exact path={["/", "/WelcomePage"]} component={WelcomePage} />         
          <Route exact path={["/", "/Graficos"]} component={Graficos} />  
          <Route exact path={["/", "/LoginPage"]} component={LoginPage} />         

          <Route exact path="/NovoFornecedor" component={NovoFornecedor} />
          <Route path="/Produtos/fornecedor/:id/produto" component={CriarProduto} />
          <Route exact path="/NovaMovimentacao" component={NovaMovimentacao} />

          <Route path="/Produtos/:id" component={Produtos} />
          <Route path="/Fornecedores/:id" component={Fornecedores} />      
          <Route path="/Movimentacoes/:id" component={Movimentacoes} />      
        </Switch>
      </div>

    </AuthProvider>

  );
}


export default App;

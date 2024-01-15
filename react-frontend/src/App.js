import React from "react"; // biblioteca principal
import { Switch, Route, Link } from "react-router-dom"; // roteamento
import "bootstrap/dist/css/bootstrap.min.css"; // importa bootstrap como estilo 
import "./App.css"; // importa estilo do projeto
import "@fortawesome/fontawesome-free/css/all.css"; // importa FA
import "@fortawesome/fontawesome-free/js/all.js"; // importa FA

//componentes livros
import ListaDeLivros from "./componentes/ListaLivros";
import Livro from "./componentes/Livro";
import CriarLivro from "./componentes/NovoLivro";


//componentes bibliotecas
import ListaDeBibliotecas from "./componentes/ListaBibliotecas";
import Biblioteca from "./componentes/Biblioteca";
import NovaBiblioteca from "./componentes/NovaBiblioteca";


//componentes BibliotecaGerency
import ListaDeBibliotecaGerency from "./componentes/ListaBibliotecaGerency";
import BibliotecaGerency from "./componentes/ListaLivrosNaBiblioteca";
import CriarVinculo from "./componentes/Vinculo";



function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <a href="/Bibliotecas" className="navbar-brand">
          Programação III
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/Livros"} className="nav-link">
              Livros
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/Bibliotecas"} className="nav-link">
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
          <Route exact path={["/", "/Livros"]} component={ListaDeLivros} />
          <Route exact path={["/", "/Bibliotecas"]} component={ListaDeBibliotecas} />
          <Route exact path={["/", "/BibliotecaGerency"]} component={ListaDeBibliotecaGerency} />
          <Route exact path={["/", "/BibliotecaGerency/livrosDaBiblioteca/:id"]} component={BibliotecaGerency} />          

          <Route path="/Livros/:id" component={Livro} />
          <Route path="/Bibliotecas/:id" component={Biblioteca} />      

          <Route exact path="/NovaBiblioteca" component={NovaBiblioteca} />
          <Route exact path="/NovoLivro" component={CriarLivro} />
          <Route exact path="/Vinculo" component={CriarVinculo} />
        </Switch>
      </div>
    </div>
    
  );
}

export default App;

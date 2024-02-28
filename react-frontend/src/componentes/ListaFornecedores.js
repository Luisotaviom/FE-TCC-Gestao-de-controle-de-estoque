import React, { useState, useEffect, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import FornecedoresDataService from "../services/GerencyService2";
import styles from '../CSS/listaFornecedor.module.css'; 
import Select from 'react-select';

const ListaDeFornecedores = (props) => {

  const [fornecedores, definirFornecedores] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const fornecedoresRef = useRef();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(4);
  const pageSizes = [4, 8, 12];
  const [selectedOptions] = useState([]);


  fornecedoresRef.current = fornecedores;

  const buscarVariaveisDePaginacao = (page, pageSize, ativo) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }
    
    if (ativo) {
      params["ativo"] = ativo;
    }

    return params;
  };

  const buscarFornecedores = () => {
    const params = buscarVariaveisDePaginacao(page, pageSize, selectedStatus);
  
    // Filtra as opções selecionadas para identificar tipos específicos
    const tipos = selectedOptions
      .filter(option => option.value.startsWith('tipo-'))
      .map(option => option.value.replace('tipo-', ''));
  
    // Adiciona o primeiro tipo encontrado, se houver
    if (tipos.length > 0) {
      params.tipo = tipos[0]; 
    }
  
    // Decide qual função de serviço usar baseado na presença de filtros
    // Se `selectedStatus` ou `tipos` estiverem definidos, usa um serviço que aplica filtros
    // Caso contrário, busca todos fornecedores sem filtros
    if (selectedStatus || tipos.length > 0) {
      // Assume que `getStatus` é o método que aplica os filtros
      FornecedoresDataService.getStatus(params)
        .then(handleResponse)
        .catch(handleError);
    } else {
      // Assume que `getAll` é o método que busca todos fornecedores
      FornecedoresDataService.getAll2(params) // Verifique o nome correto do método para buscar todos
        .then(handleResponse)
        .catch(handleError);
    }
  };
  

const opcoesStatus = [
  { value: true, label: 'Ativo' },
  { value: false, label: 'Inativo' }
];


  const handleResponse = (response) => {
    const movimentacoes = response.data.content;
    const totalPages = response.data.totalPages;

    definirFornecedores(movimentacoes);
    setCount(totalPages);
  };

  const handleError = (error) => {
    console.error(error);
  };
  

  const openFornecedores = (rowIndex) => {
    const id = fornecedoresRef.current[rowIndex].id;

    props.history.push("/Fornecedores/" + id);
  };

  const openFornecedorProduto = (rowIndex) => {
    const id = fornecedoresRef.current[rowIndex].id;

    props.history.push("/Produtos/fornecedor/" + id  );
  };

  const openNovoProduto = (rowIndex) => {
    const id = fornecedoresRef.current[rowIndex].id;
    props.history.push("/Produtos/fornecedor/" + id + "/produto");
  };
  

  useEffect(buscarFornecedores, [page, pageSize, selectedStatus, selectedOptions]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleStatusChange = selectedOption => {
    setSelectedStatus(selectedOption ? selectedOption.value : "");
  };
  

  function formatPhoneNumber(phoneString) {
    const cleaned = ('' + phoneString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return null;
  }

  return (
    <div className={`${styles.list} row`}>
    <div className="col-md-12">
      <h2 className={styles.h2}>Lista de Fornecedores</h2>
      <div className="d-flex justify-content-between mt-3">
        <div>
          <span className="mr-2">Itens por página:</span>
          <select className="custom-select" style={{ width: 'auto' }} onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

          <div>
          <span className="mr-2">Status:</span>
          <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={selectedOptions}
            isClearable={true}
            isSearchable={true}
            name="status"
            options={opcoesStatus}
            onChange={handleStatusChange}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: '30px',
                height: '30px',
                width: '200px', // Ajuste a largura conforme necessário
              }),
              indicatorsContainer: (provided) => ({
                ...provided,
                height: '30px',
              }),
              clearIndicator: (provided) => ({
                ...provided,
                padding: '5px',
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                padding: '5px',
              }),
              valueContainer: (provided) => ({
                ...provided,
                height: '30px',
                padding: '0 6px',
              }),
              input: (provided) => ({
                ...provided,
                margin: '0px',
              }),
              singleValue: (provided) => ({
                ...provided,
                fontSize: '14px',
              }),
            }}
          />

          <div className={styles.cardContainer}>
            {fornecedores.map((fornecedor) => (
              <div key={fornecedor.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h5>{fornecedor.nome}</h5>
                </div>
                <div className={styles.cardBody}>
                  <p>Cidade: {fornecedor.cidade}</p>
                  <p>Telefone: {formatPhoneNumber(fornecedor.celular)}</p>
                  <p>Email: {fornecedor.email}</p>
                  <p>Status: <span className={fornecedor.ativo ? 'ativo' : 'inativo'}>{fornecedor.ativo ? 'Ativo' : 'Inativo'}</span></p>
                  <div className={styles.actionButtons}>
                    <button
                      type="button"
                      className={`${styles.button_edit} ${styles.editButton}`}
                      onClick={() => openFornecedores(fornecedor.id)}
                    >
                      Editar fornecedor
                    </button>
                    <button
                      type="button"
                      className={`${styles.button_ver} ${styles.viewProductsButton}`}
                      onClick={() => openFornecedorProduto(fornecedor.id)}
                    >
                      Ver produtos
                    </button>
                    <button
                      type="button"
                      className={`${styles.button_add} ${styles.addProductButton}`}
                      onClick={() => openNovoProduto(fornecedor.id)}
                    >
                      Adicionar produto
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          </div>
          </div>
        </div>

        <table
          className={`table ${styles.listTable}`}
        >
          <thead>
            {((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>


                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {((row, i) => {
              ;
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={`pagination-container ${styles.paginationContainer}`}>
          {"Itens por página: "}
          <select onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <div>
            <button type="button" className={`${styles.button_add}`} onClick={() => props.history.push("/NovoFornecedor")}>
              Criar Fornecedores
            </button>
          </div>

          <Pagination
            color="primary"
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            onChange={handlePageChange}
          />
        </div>
      </div>    
  );
};

export default ListaDeFornecedores;
